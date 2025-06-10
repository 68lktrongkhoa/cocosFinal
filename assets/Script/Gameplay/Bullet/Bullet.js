cc.Class({
    extends: cc.Component,

    properties: {
        speed: 1500,
        damage: {
            default: 3,
            type: cc.Integer
        }
    },
    _projectileManager: null,
    _direction: null,

    init(manager, direction) {
        this._projectileManager = manager; 
        this._direction = direction;
    },

    update(dt) {
        if (!this._direction) return;

        const distance = this.speed * dt;
        
        this.node.x += this._direction.x * distance;
        this.node.y += this._direction.y * distance;
        
        this.checkOutOfBounds();
    },

    onCollisionEnter(other, self) {
        if (other.node.group === 'Enemy') {
            const enemyScript = other.getComponent('Enemy');
            if (enemyScript && enemyScript.takeDamage) {
                enemyScript.takeDamage(this.damage);
            }
            this.returnToPool();
        }
    },

    checkOutOfBounds() {
        const canvas = cc.find('Canvas'); 
        if (!canvas) return;

        const worldRect = cc.rect(-canvas.width / 2 - 100, -canvas.height / 2 - 100, canvas.width + 200, canvas.height + 200);


        if (!worldRect.contains(this.node.position)) {
            this.returnToPool();
        }
    },

    returnToPool() {
        if (this._projectileManager) {
            this._projectileManager.putProjectile(this.node);
        } else {
            cc.warn("Bullet cannot find its manager to return to pool. Destroying self.");
            this.node.destroy();
        }
    },
    
    reuse() {
        this._direction = null;
        let collider = this.getComponent(cc.Collider);
        if (collider) {
            collider.enabled = true;
        }
    },

    unuse() {
        let collider = this.getComponent(cc.Collider);
        if (collider) {
            collider.enabled = false;
        }
    }
});