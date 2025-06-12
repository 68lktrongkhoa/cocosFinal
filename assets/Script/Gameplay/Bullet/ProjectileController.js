const Emitter = require('../../Common/Event/Emitter'); 
const EventKey = require('../../Common/Event/EventKeys');
const GameEnums = require('../../Common/GameEnums');
const GameConfig = require("GameConfig");
const DataStorageController = require('DataStorageController');

const ProjectileType = GameEnums.ProjectileType;

cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: { default: null, type: cc.ProgressBar },
        button: { default: null, type: cc.Button },
        cooldownLabel: { default: null, type: cc.Label },
        bulletPrefab: { default: null, type: cc.Prefab },
        laserPrefab: { default: null, type: cc.Prefab }
    },
    _cooldownSprite: null,

    onLoad() {
        this.bulletPool = new cc.NodePool('Bullet');
        this.laserPool = new cc.NodePool('Laser');
        this.prepopulatePools();
        Emitter.registerEvent(EventKey.GAMEPLAY.FIRE_PROJECTILE, this.onCharacterFire, this);
        this.initFromConfig();
        if (this.progressBar) {
            this._cooldownSprite = this.progressBar.getComponent(cc.Sprite);
        }
        this.cooldownTimer = 0;
        if(this.button) this.button.interactable = true;
        if(this.progressBar) this.progressBar.progress = false;
        if(this.cooldownLabel) this.cooldownLabel.node.active = false;
    },

    prepopulatePools() {
        this._populatePool(this.bulletPool, this.bulletPrefab, GameConfig.PERFORMANCE.POOL_SIZE.BULLET);
        this._populatePool(this.laserPool,this.laserPrefab,GameConfig.PERFORMANCE.POOL_SIZE.LASER);
    },

    _populatePool(pool, prefab, size) {
        if (!pool || !prefab || !size || size <= 0) {
            return;
        }

        for (let i = 0; i < size; ++i) {
            const newNode = cc.instantiate(prefab);
            pool.put(newNode);
        }
    },

    initFromConfig() {
        const upgradeStats = DataStorageController.getUpgradeStat();
        const switchGunLevel = upgradeStats.skill_switch_gun || 1;
        this.cooldown = GameConfig.STAT.SKILL.SWITCH_GUN[switchGunLevel - 1].cooldown;
        this.availableWeapons = [ProjectileType.BULLET, ProjectileType.LASER];
        this.currentWeaponIndex = 0;
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
        if (this.cooldownTimer > 0) return; 
        if (this.availableWeapons.length <= 1) return;
    
        this.currentWeaponIndex = (this.currentWeaponIndex + 1) % this.availableWeapons.length;
    
        this.startCooldown();
        Emitter.emit(EventKey.GAMEPLAY.WEAPON_SWITCHED, this.getCurrentProjectileType());
    },

    getCurrentFireInterval() {
        const currentType = this.getCurrentProjectileType();
        const upgradeStats = DataStorageController.getUpgradeStat();
        let weaponConfig;

        if (currentType === ProjectileType.BULLET) {
            const bulletLevel = upgradeStats.gun_bullet || 1;
            weaponConfig = GameConfig.STAT.GUN.BULLET[bulletLevel - 1];
        } else if (currentType === ProjectileType.LASER) {
            const laserLevel = upgradeStats.gun_laser || 1;
            weaponConfig = GameConfig.STAT.GUN.LASER[laserLevel - 1];
        }

        if (weaponConfig && weaponConfig.fireRate > 0) {
            return 1 / weaponConfig.fireRate;
        }
        return 0;
    },
    
    getCurrentProjectileType() {
        return this.availableWeapons[this.currentWeaponIndex];
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
        this.emitSFX(projectileType);
    },

    emitSFX(projectileType){
        switch (projectileType) {
            case ProjectileType.BULLET:
                Emitter.emit(EventKey.SOUND.PLAY_SFX, GameConfig.SOUND.GUN);
                break;
            case ProjectileType.LASER:
                Emitter.emit(EventKey.SOUND.PLAY_SFX, GameConfig.SOUND.LASER);
                break;
            default:
                cc.warn(`Unknown projectile type: ${projectileType}`);
                break;
        }
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