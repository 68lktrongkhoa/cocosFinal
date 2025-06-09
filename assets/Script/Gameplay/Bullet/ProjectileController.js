import BulletState from './WeaponStates/BulletState.js';
cc.Class({
    extends: cc.Component,

    properties: {
        cooldown: {
            default: 15.0,
            type: cc.Float,
        },
        progressBar: {
            default: null,
            type: cc.ProgressBar
        },
        button: {
            default: null,
            type: cc.Button
        },
        cooldownLabel: {
            default: null,
            type: cc.Label
        },
        bulletPrefab: {
            default: null,
            type: cc.Prefab
        },
        laserPrefab: {
            default: null,
            type: cc.Prefab
        },
        characterNode: {
            default: null,
            type: cc.Node
        },
        poolSize: 20,
    },

    onLoad() {
        this.bulletPool = new cc.NodePool('Bullet');
        this.laserPool = new cc.NodePool('Laser');

        if (this.characterNode) {
            this.characterNode.on('fire-projectile', this.onCharacterFire, this);
        } else {
            cc.warn("Not have Character Node for ProjectileController!");
        }

        this.state = null;
        this.setState(new BulletState(this));
        this.cooldownTimer = 0;
    },

    update(dt) {
        if (this.cooldownTimer > 0) {
            this.cooldownTimer -= dt;
            
            const progress = 1 - (this.cooldownTimer / this.cooldown);
            if(this.progressBar) this.progressBar.progress = Math.max(0, progress);
            if(this.cooldownLabel) this.cooldownLabel.string = Math.ceil(this.cooldownTimer);

            if (this.cooldownTimer <= 0) {
                this.cooldownTimer = 0;
                if(this.button) this.button.interactable = true;
                if(this.progressBar) this.progressBar.progress = 1;
                if(this.cooldownLabel) this.cooldownLabel.node.active = false;
            }
        }
    },
    
    onDestroy() {
        if (this.characterNode) {
            this.characterNode.off('fire-projectile', this.onCharacterFire, this);
        }
        this.bulletPool.clear();
        this.laserPool.clear();
    },

    handleInput(command, isPressed) {
        if (isPressed && this.cooldownTimer <= 0) {
            if (this.state && this.state.handleInput) {
                this.state.handleInput(command);
            }
        }
    },
    
    getCurrentProjectileType() {
        return this.state.getProjectileType();
    },

    startCooldown() {
        this.cooldownTimer = this.cooldown;
        if(this.button) this.button.interactable = false;
        if(this.cooldownLabel) this.cooldownLabel.node.active = true;
    },

    setState(newState) {
        if (this.state && this.state.exit) this.state.exit();
        this.state = newState;
        if (this.state && this.state.enter) this.state.enter();
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

        if (type === 'laser') {
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
            console.warn(`Pool for ${type} is empty, creating new one.`);
        }

        if (projectile) {
            projectile.parent = this.node.parent;
            projectile.position = position;

            let script = projectile.getComponent(type.charAt(0).toUpperCase() + type.slice(1));
            if (script) {
                script.init(this, direction);
            }
        }
        return projectile;
    },

    putProjectile(projectile) {
        if (!projectile || !cc.isValid(projectile)) {
            cc.warn("Attempting to put an invalid projectile back to pool.");
            return;
        }

        if (projectile.getComponent('Laser')) {
            this.laserPool.put(projectile);
        } else if (projectile.getComponent('Bullet')) {
            this.bulletPool.put(projectile);
        }
    }
});