cc.Class({
    extends: cc.Component,

    properties: {
        characterNode: {
            default: null,
            type: cc.Node
        }
    },

    onLoad() {

        this.characterController = this.characterNode.getComponent('CharacterController');
        if (!this.characterController) {
            return;
        }

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    onKeyDown(event) {
        let command = null;
        switch(event.keyCode) {
            case cc.macro.KEY.up:
            case cc.macro.KEY.w:
                command = "MOVE_UP";
                break;
            case cc.macro.KEY.down:
            case cc.macro.KEY.s:
                command = "MOVE_DOWN";
                break;
        }

        if (command) {
            this.characterController.handleInput(command);
        }
    },
});