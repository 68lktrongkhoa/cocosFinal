const Emitter = require('../../Common/Event/Emitter'); 
const EventKey = require('../../Common/Event/EventKeys');
const GameEnums = require('../../Common/GameEnums');
const WeaponStats = require('../../Common/WeaponStats');

const ProjectileType = GameEnums.ProjectileType;

cc.Class({
    extends: cc.Component,

    properties: {
        cooldown: { default: 15.0, type: cc.Float },
        progressBar: { default: null, type: cc.ProgressBar },
        button: { default: null, type: cc.Button },
        cooldownLabel: { default: null, type: cc.Label },
        bulletPrefab: { default: null, type: cc.Prefab },
        laserPrefab: { default: null, type: cc.Prefab },
        poolSize: 20,
        weaponStats: {
            default: [],
            type: [WeaponStats]
        },
    },
    _cooldownSprite: null,

    onLoad() {
        this.bulletPool = new cc.NodePool('Bullet');
        this.laserPool = new cc.NodePool('Laser');
        Emitter.registerEvent(EventKey.GAMEPLAY.FIRE_PROJECTILE, this.onCharacterFire, this);
        this.currentWeaponIndex = 0;
        this.weaponStatsMap = new Map();
        this.weaponStats.forEach(stat => {
            this.weaponStatsMap.set(stat.type, stat);
        });
        if (this.progressBar) {
            this._cooldownSprite = this.progressBar.getComponent(cc.Sprite);
            if (!this._cooldownSprite) {
                cc.warn("Node chứa ProgressBar cần phải có cả component Sprite để hiển thị cooldown hình tròn!");
            }
        }
        this.cooldownTimer = 0;
        if(this.button) this.button.interactable = true;
        if(this.progressBar) this.progressBar.progress = false;
        if(this.cooldownLabel) this.cooldownLabel.node.active = false;
    },

    update(dt) {
        if (this.cooldownTimer > 0) {
            this.cooldownTimer -= dt;
            const fillValue = this.cooldownTimer / this.cooldown;
            if (this.progressBar) {
                this.progressBar.progress = Math.max(0, fillValue);
            }
            if (this._cooldownSprite) {
                this._cooldownSprite.fillRange = Math.max(0, fillValue);
            }
            const progress = 1 - (this.cooldownTimer / this.cooldown);
            if(this.progressBar) this.progressBar.progress = Math.max(0, progress);
            if(this.cooldownLabel) this.cooldownLabel.string = Math.ceil(this.cooldownTimer);
            if (this.cooldownTimer <= 0) {
                this.cooldownTimer = 0;
                if(this.button) this.button.interactable = true;
                if(this.progressBar) this.progressBar.progress = false;
                if(this.cooldownLabel) this.cooldownLabel.node.active = false;
            }
        }
    },
    
    onDestroy() {
        Emitter.removeEventsByTarget(this);
        this.bulletPool.clear();
        this.laserPool.clear();
    },

    handleInput(command, isPressed) {
        if (command === "TOGGLE_WEAPON" && isPressed) {
            this.trySwitchWeapon();
        }
    },

    trySwitchWeapon() {
        if (this.cooldownTimer > 0) {
            
            return; 
        }
    
        if (this.weaponStats.length <= 1) return;
        this.currentWeaponIndex = (this.currentWeaponIndex + 1) % this.weaponStats.length;
    
        this.startCooldown();
        Emitter.emit(EventKey.GAMEPLAY.WEAPON_SWITCHED);
    },

    getCurrentFireInterval() {
        const currentType = this.getCurrentProjectileType();
        const currentStats = this.weaponStatsMap.get(currentType);
        if (currentStats && currentStats.fireRate > 0) {
            return 1 / currentStats.fireRate;
        }
        return 0;
    },
    
    getCurrentProjectileType() {
        if (this.weaponStats.length > 0) {
            return this.weaponStats[this.currentWeaponIndex].type;
        }
        return ProjectileType.BULLET;
    },

    startCooldown() {
        this.cooldownTimer = this.cooldown;
        if(this.button) this.button.interactable = false;
        if(this.cooldownLabel) this.cooldownLabel.node.active = true;
        if (this.progressBar) {
            this.progressBar.node.active = true;
        }
        if (this.progressBar) this.progressBar.progress = 1;
        if (this._cooldownSprite) this._cooldownSprite.fillRange = 1;
    },
    
    onCharacterFire(eventData) {
        const worldPos = eventData.position;
        const direction = eventData.direction;
        const projectileType = eventData.type;
        const firePointNodePos = this.node.parent.convertToNodeSpaceAR(worldPos);
        this.getProjectile(projectileType, firePointNodePos, direction);
    },

    getProjectile(type, position, direction) {
        let projectile = null;
        let pool = null;
        let prefab = null;

        const typeString = Object.keys(ProjectileType)[type].toLowerCase();
        const componentName = typeString.charAt(0).toUpperCase() + typeString.slice(1);

        if (type === ProjectileType.LASER) {
            pool = this.laserPool;
            prefab = this.laserPrefab;
        } else { 
            pool = this.bulletPool;
            prefab = this.bulletPrefab;
        }

        if (pool.size() > 0) {
            projectile = pool.get();
        } else {
            projectile = cc.instantiate(prefab);
        }

        if (projectile) {
            projectile.parent = this.node.parent;
            projectile.position = position;
            let script = projectile.getComponent(componentName);
            if (script && script.init) {
                script.init(this, direction);
            }
        }
    },

    putProjectile(projectile) {
        if (!projectile || !cc.isValid(projectile)) return;
        if (projectile.getComponent('Laser')) {
            this.laserPool.put(projectile);
        } else if (projectile.getComponent('Bullet')) {
            this.bulletPool.put(projectile);
        }
    }
});