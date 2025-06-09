cc.Class({
    extends: cc.Component,

    properties: {
        upButtonNode: {
            default: null,
            type: cc.Node
        },
        downButtonNode: {
            default: null,
            type: cc.Node
        },
        fireButtonNode: {
            default: null,
            type: cc.Node
        },
    },

    onLoad() {

        if (this.upButtonNode) this.originalUpScale = this.upButtonNode.scale;
        if (this.downButtonNode) this.originalDownScale = this.downButtonNode.scale;
        if (this.fireButtonNode) this.originalFireScale = this.fireButtonNode.scale;
    },

    onEnable() {
        if (this.upButtonNode) this.upButtonNode.on(cc.Node.EventType.TOUCH_START, this.onMoveUp, this);
        if (this.downButtonNode) this.downButtonNode.on(cc.Node.EventType.TOUCH_START, this.onMoveDown, this);
        if (this.fireButtonNode) {
            this.fireButtonNode.on(cc.Node.EventType.TOUCH_START, this.onFireDown, this);
            this.fireButtonNode.on(cc.Node.EventType.TOUCH_END, this.onFireUp, this);
            this.fireButtonNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onFireUp, this);
        }
    },

    onDisable() {
        if (this.upButtonNode) this.upButtonNode.off(cc.Node.EventType.TOUCH_START, this.onMoveUp, this);
        if (this.downButtonNode) this.downButtonNode.off(cc.Node.EventType.TOUCH_START, this.onMoveDown, this);
        if (this.fireButtonNode) {
            this.fireButtonNode.off(cc.Node.EventType.TOUCH_START, this.onFireDown, this);
            this.fireButtonNode.off(cc.Node.EventType.TOUCH_END, this.onFireUp, this);
            this.fireButtonNode.off(cc.Node.EventType.TOUCH_CANCEL, this.onFireUp, this);
        }
    },
    
    onMoveUp() {
        if (this.inputHandler) this.inputHandler.processCommand("MOVE_UP");
    },

    onMoveDown() {
        if (this.inputHandler) this.inputHandler.processCommand("MOVE_DOWN");
    },
    
    onFireDown() {
        if (this.inputHandler) this.inputHandler.processCommand("FIRE", true);
    },

    onFireUp() {
        if (this.inputHandler) this.inputHandler.processCommand("FIRE", false);
    },

    playButtonEffect(buttonType) {
        let targetNode = null;
        if (buttonType === 'UP') targetNode = this.upButtonNode;
        if (buttonType === 'DOWN') targetNode = this.downButtonNode;
        if (buttonType === 'FIRE') targetNode = this.fireButtonNode;
        
        if (targetNode) {
            const originalScale = targetNode.scale;
            const buttonComp = targetNode.getComponent(cc.Button);
            const zoomScale = buttonComp ? buttonComp.zoomScale : 1.2;
            const duration = buttonComp ? buttonComp.duration : 0.1;

            cc.tween(targetNode)
                .to(duration / 2, { scale: originalScale * zoomScale })
                .to(duration / 2, { scale: originalScale })
                .start();
        }
    }
});