cc.Class({
    extends: cc.Component,

    properties: {
        duration: {
            default: 0.1,
            type: cc.Float
        },
        zoomScale: {
            default: 1.2,
            type: cc.Float
        },
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
        this.originalScales = new Map();
        if (this.upButtonNode) this.originalScales.set(this.upButtonNode, this.upButtonNode.scale);
        if (this.downButtonNode) this.originalScales.set(this.downButtonNode, this.downButtonNode.scale);
        if (this.fireButtonNode) this.originalScales.set(this.fireButtonNode, this.fireButtonNode.scale);
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
        this.node.emit('ui-command', { command: "MOVE_UP" });
    },

    onMoveDown() {
        this.node.emit('ui-command', { command: "MOVE_DOWN" });
    },
    
    onFireDown() {
        this.node.emit('ui-command', { command: "FIRE", isPressed: true });
    },

    onFireUp() {
        this.node.emit('ui-command', { command: "FIRE", isPressed: false });
    },

    playButtonPressEffect(buttonType) {
        const targetNode = this._getTargetNode(buttonType);
        if (!targetNode) return;

        cc.Tween.stopAllByTarget(targetNode);
        const originalScale = this.originalScales.get(targetNode) || 1;
        
        cc.tween(targetNode)
            .to(this.duration / 2, { scale: originalScale * this.zoomScale })
            .start();
    },

    playButtonReleaseEffect(buttonType) {
        const targetNode = this._getTargetNode(buttonType);
        if (!targetNode) return;

        cc.Tween.stopAllByTarget(targetNode);
        const originalScale = this.originalScales.get(targetNode) || 1;

        cc.tween(targetNode)
            .to(this.duration / 2, { scale: originalScale })
            .start();
    },

    _getTargetNode(buttonType) {
        if (buttonType === 'UP') return this.upButtonNode;
        if (buttonType === 'DOWN') return this.downButtonNode;
        if (buttonType === 'FIRE') return this.fireButtonNode;
        return null;
    }
});