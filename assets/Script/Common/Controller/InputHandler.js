const CharacterController = require('./Gameplay/Character/CharacterController'); 
const ButtonHandler = require('./ButtonHandler'); 
const ProjectileController = require('../../Gameplay/Bullet/ProjectileController');

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
        },
        skillButton: {
            default: null,
            type: cc.Button
        },
        projectileController: {
            default: null,
            type: ProjectileController
        },
    },

    onLoad() {
        if (this.buttonHandlerNode) {
            this.buttonHandlerComponent = this.buttonHandlerNode.getComponent(ButtonHandler);
        } else {
            cc.warn("Not have buttonHandlerNode for InputHandler!");
        }
        this.keysDown = {};
        this._isShooting = false;
    },

    onEnable() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        if (this.buttonHandlerNode) {
            this.buttonHandlerNode.on('ui-command', this.onUICommand, this);
        }
        if (this.skillButton) {
            this.skillButton.node.on('click', this.onSkillButtonClick, this);
        }
    },

    onDisable() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        if (this.buttonHandlerNode) {
            this.buttonHandlerNode.off('ui-command', this.onUICommand, this);
        }
        if (this.skillButton) {
            this.skillButton.node.off('click', this.onSkillButtonClick, this);
        }
    },


    onUICommand(eventData) {
        if (eventData.command === "FIRE") {
            this._isShooting = eventData.isPressed;
        }
        this.processCommand(eventData.command, eventData.isPressed);
    },

    onKeyDown(event) {
        const keyCode = event.keyCode;
        if (this.keysDown[keyCode]) return;
        this.keysDown[keyCode] = true;

        this._processKeyboard(keyCode, true);
    },
    
    onKeyUp(event) {
        const keyCode = event.keyCode;
        this.keysDown[keyCode] = false; 

        this._processKeyboard(keyCode, false);
    },

    onSkillButtonClick() {
        this.processCommand("TOGGLE_WEAPON", true);
    },

    processCommand(command, isPressed) {
        if (command === "TOGGLE_WEAPON") {
            if (isPressed && this.projectileController) {
                this.projectileController.handleInput(command, isPressed);
            }
            return; 
        }
    
        if (this.characterController) {
            this.characterController.handleInput(command, isPressed);
        }
    
        if (this.buttonHandlerComponent) {
            let buttonType = null;
            if (command === "MOVE_UP") buttonType = 'UP';
            if (command === "MOVE_DOWN") buttonType = 'DOWN';
            if (command === "FIRE") buttonType = 'FIRE';
    
            if (buttonType) {
                if (buttonType === 'UP' || buttonType === 'DOWN') {
                    if (isPressed) {
                        this.buttonHandlerComponent.playButtonTapEffect(buttonType);
                    }
                } else if (buttonType === 'FIRE') {
                    if (isPressed) {
                        this.buttonHandlerComponent.playButtonPressEffect(buttonType);
                    } else {
                        this.buttonHandlerComponent.playButtonReleaseEffect(buttonType);
                    }
                }
            }
        }
    },

    _processKeyboard(keyCode, isPressed) {
        if (keyCode === cc.macro.KEY.space) {
            this._isShooting = isPressed;
        }
        switch(keyCode) {
            case cc.macro.KEY.up: case cc.macro.KEY.w:
                if (isPressed) this.processCommand("MOVE_UP", true);
                break;
            case cc.macro.KEY.down: case cc.macro.KEY.s:
                if (isPressed) this.processCommand("MOVE_DOWN", true);
                break;
            case cc.macro.KEY.space:
                this.processCommand("FIRE", isPressed);
                break; 
            case cc.macro.KEY.e:
                if (isPressed) this.processCommand("TOGGLE_WEAPON", true);
                break;
        }
    }
});