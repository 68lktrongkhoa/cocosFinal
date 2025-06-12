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
        skillButton: {
            default: null,
            type: cc.Button
        }
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

    onMoveUp(event) {
        this.node.emit('ui-command', { command: "MOVE_UP", isPressed: true });
        event.stopPropagation() 
    },

    onMoveDown(event) {
        this.node.emit('ui-command', { command: "MOVE_DOWN", isPressed: true });
        event.stopPropagation()
    },
    
    onFireDown(event) {
        if (this.skillButton) {
            this.skillButton.interactable = false; 
        }

        this.node.emit('ui-command', { command: "FIRE", isPressed: true });
        event.stopPropagation();
    },

    onFireUp(event) {
        if (this.skillButton) {
            this.skillButton.interactable = true; 
        }

        this.node.emit('ui-command', { command: "FIRE", isPressed: false });
        event.stopPropagation();
    },

    playButtonTapEffect(buttonType) {
        const targetNode = this._getTargetNode(buttonType);
        if (!targetNode) return;

        targetNode.stopAllActions();
        const originalScale = this.originalScales.get(targetNode) || 1;
        
        cc.tween(targetNode)
            .to(this.duration / 2, { scale: originalScale * this.zoomScale })
            .to(this.duration / 2, { scale: originalScale })
            .start();
    },

    playButtonPressEffect(buttonType) {
        const targetNode = this._getTargetNode(buttonType);
        if (!targetNode) return;

        targetNode.stopAllActions();
        const originalScale = this.originalScales.get(targetNode) || 1;
        
        cc.tween(targetNode)
            .to(this.duration / 2, { scale: originalScale * this.zoomScale })
            .start();
    },

    playButtonReleaseEffect(buttonType) {
        const targetNode = this._getTargetNode(buttonType);
        if (!targetNode) return;

        targetNode.stopAllActions();
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