cc.Class({
    extends: cc.Component,

    properties: {
        duration: 5, 
        damage: {
            default: 10,
            type: cc.Integer
        }
    },

    init(projectileController, direction) {
        this.projectileController = projectileController;
        this.direction = direction;
        
        this.node.scaleX = this.direction.x > 0 ? 1 : -1;
        this.unscheduleAllCallbacks();

        this.scheduleOnce(() => {
            if (this.projectileController && cc.isValid(this.projectileController.node)) {
                 this.projectileController.putProjectile(this.node);
            } else {
                 this.node.destroy();
            }
        }, this.duration);
    },
    
});