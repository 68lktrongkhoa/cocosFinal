import FiringState from './FiringState.js';
import MovingState from './MovingState.js';

export default class IdleState {
    constructor(controller) {
        this.controller = controller;
    }

    enter() {
        this.controller.spineAnim.setAnimation(0, 'hoverboard', true);
    }

    update(dt) {
        if (this.controller.isFireButtonPressed) {
            if (this.controller._fireCooldown <= 0) {
                this.controller.setState(new FiringState(this.controller));
            }
        }
    }
    
    handleInput(command, isPressed) {
        if (isPressed) {
            if (command === 'MOVE_UP' || command === 'MOVE_DOWN') {
                this.controller.setState(new MovingState(this.controller, command));
            }
        }
    }
}