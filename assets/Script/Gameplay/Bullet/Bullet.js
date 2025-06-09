cc.Class({
    extends: cc.Component,

    properties: {
        speed: {
            default: 1500
        },
    },

    init(bulletController, direction) {
        this.bulletController = bulletController;

        this.direction = direction;

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },

    update(dt) {
        if (!this.direction) return;

        const distance = this.speed * dt;
        
        this.node.x += this.direction.x * distance;
        this.node.y += this.direction.y * distance;
        this.checkOutOfBounds();
    },

    onCollisionEnter(other, self) {
        if (other.getComponent('Enemy')) {
            this.bulletController.putBullet(this.node);
        }
    },

    checkOutOfBounds() {
        const canvas = cc.find('Canvas'); 
        if (!canvas) return;

        const halfWidth = canvas.width / 2;
        const halfHeight = canvas.height / 2;

        if (this.node.x > halfWidth + 100 || 
            this.node.x < -halfWidth - 100 ||
            this.node.y > halfHeight + 100 ||
            this.node.y < -halfHeight - 100) 
        {
            this.bulletController.putBullet(this.node);
        }
    }
});