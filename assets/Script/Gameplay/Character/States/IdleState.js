import FiringState from './FiringState.js';
import MovingState from './MovingState.js';

export default class IdleState {
    constructor(controller) {
        this.controller = controller;
    }

    enter() {
        if (this.controller.isFireButtonPressed) {
            this.controller.setState(new FiringState(this.controller));
            return;
        }
        this.controller.spineAnim.setAnimation(0, 'hoverboard', true);
    }
    
    handleInput(command, isPressed) {
        if (isPressed) {
            if (command === 'MOVE_UP' || command === 'MOVE_DOWN') {
                this.controller.setState(new MovingState(this.controller, command));
            } else if (command === "FIRE") {
                this.controller.setState(new FiringState(this.controller));
            }
        }
    }
}