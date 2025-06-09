import State from '../../../Common/Patterns/State.js';
import IdleState from './IdleState.js';

export default class FiringState extends State {
    enter() {
        this.controller.fireBullet(); 
        this.fireTimer = 0;
    }

    update(dt) {
        this.fireTimer += dt;
        if (this.fireTimer >= 1 / this.controller.fireRate) {
            this.controller.fireBullet();
            this.fireTimer -= (1 / this.controller.fireRate);
        }
    }

    handleInput(command, isPressed) {
        if (command === "FIRE" && !isPressed) {
            this.controller.setState(new IdleState(this.controller));
        }
    }
}