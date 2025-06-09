const CharacterController = require('./Gameplay/Character/CharacterController'); 
const ButtonHandler = require('./ButtonHandler'); 

cc.Class({
    extends: cc.Component,

    properties: {
        characterController: {
            default: null,
            type: CharacterController
        },
        buttonHandler: {
            default: null,
            type: ButtonHandler
        }
    },

    onEnable() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onDisable() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyDown(event) {
        if (!this.characterController) return;

        let command = null;
        let buttonType = null;

        switch(event.keyCode) {
            case cc.macro.KEY.up:
            case cc.macro.KEY.w:
                command = "MOVE_UP";
                buttonType = 'UP';
                break;
            case cc.macro.KEY.down:
            case cc.macro.KEY.s:
                command = "MOVE_DOWN";
                buttonType = 'DOWN';
                break;
            case cc.macro.KEY.space:
                this.characterController.handleInput("FIRE", true);
                return; 
        }

        if (command) {
            this.characterController.handleInput(command);
            if (this.buttonHandler && buttonType) {
                this.buttonHandler.playButtonEffect(buttonType);
            }
        }
    },
    
    onKeyUp(event) {
        if (!this.characterController) return;

        switch(event.keyCode) {
            case cc.macro.KEY.space:
                this.characterController.handleInput("FIRE", false);
                break;
        }
    },
});