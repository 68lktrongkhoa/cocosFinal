import IdleState from './IdleState.js';
import MovingState from './MovingState.js';

export default class FiringState {
    constructor(controller) {
        this.controller = controller;
    }

    enter() {
        const fireInterval = this.controller.getFireInterval();
        this.controller.tryToFire();

        if (fireInterval > 0) {
            this.controller.schedule(this.controller.tryToFire, fireInterval);
        }
    }

    handleInput(command, isPressed) {
        if (isPressed) {
            if (command === "MOVE_UP" || command === "MOVE_DOWN") {
                this.controller.setState(new MovingState(this.controller, command));
                return;
            }
        }

        if (command === "FIRE" && !isPressed) {
            this.controller.setState(new IdleState(this.controller));
        }
    }
    
    exit() {
        this.controller.unschedule(this.controller.tryToFire);
    }

}