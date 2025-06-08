cc.Class({
    extends: cc.Component,

    properties: {
        characterNode: {
            default: null,
            type: cc.Node
        },
        upButtonNode: {
            default: null,
            type: cc.Node
        },
        downButtonNode: {
            default: null,
            type: cc.Node
        },
    },

    onLoad () {
        if (this.characterNode) {
            this.characterController = this.characterNode.getComponent('CharacterController');
        } else {
            cc.warn("Character Node chưa được gán cho ButtonHandler!");
        }
        if (this.upButtonNode) this.originalUpScale = this.upButtonNode.scale;
        if (this.downButtonNode) this.originalDownScale = this.downButtonNode.scale;
    },

    onMoveUpClicked() {
        if (this.characterController) {
            this.characterController.handleInput("MOVE_UP");
        }
    },

    onMoveDownClicked() {
        if (this.characterController) {
            this.characterController.handleInput("MOVE_DOWN");
        }
    },

    playButtonEffect(buttonType) {
        let targetNode = null;
        let originalScale = 1;

        if (buttonType === 'UP' && this.upButtonNode) {
            targetNode = this.upButtonNode;
            originalScale = this.originalUpScale;
        } else if (buttonType === 'DOWN' && this.downButtonNode) {
            targetNode = this.downButtonNode;
            originalScale = this.originalDownScale;
        }

        if (targetNode) {
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