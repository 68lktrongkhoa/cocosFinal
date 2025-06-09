const CharacterController = require('./Gameplay/Character/CharacterController'); 
const ButtonHandler = require('./ButtonHandler'); 

cc.Class({
    extends: cc.Component,

    properties: {
        characterController: {
            default: null,
            type: CharacterController
        },
        buttonHandlerNode: {
            default: null,
            type: cc.Node
        }
    },

    onLoad() {
        if (this.buttonHandlerNode) {
            this.buttonHandlerComponent = this.buttonHandlerNode.getComponent(ButtonHandler);
        } else {
            cc.warn("Note have 'Button Handler Node' of InputHandler!");
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

    processCommand(command, isPressed = true) {
        if (!this.characterController) return;
        this.characterController.handleInput(command, isPressed);

        if (this.buttonHandlerComponent) {
            let buttonType = null;
            if (command === "MOVE_UP") buttonType = 'UP';
            if (command === "MOVE_DOWN") buttonType = 'DOWN';
            if (command === "FIRE" && isPressed) buttonType = 'FIRE'; 

            if (buttonType) {
                this.buttonHandlerComponent.playButtonEffect(buttonType);
            }
        }
    },

    onKeyDown(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.up: case cc.macro.KEY.w: this.processCommand("MOVE_UP"); break;
            case cc.macro.KEY.down: case cc.macro.KEY.s: this.processCommand("MOVE_DOWN"); break;
            case cc.macro.KEY.space: this.processCommand("FIRE", true); break; 
        }
    },
    
    onKeyUp(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.space: this.processCommand("FIRE", false); break;
        }
    }
});