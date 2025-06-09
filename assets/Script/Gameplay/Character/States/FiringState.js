// FiringState.js

import State from '../../../Common/Patterns/State.js';
import IdleState from './IdleState.js';

export default class FiringState extends State {
    constructor(controller) {
        super();
        this.controller = controller;
    }

    enter() {
        const fireInterval = this.controller.getFireInterval();

        this.controller.fireProjectile();

        if (fireInterval > 0) {
            this.controller.schedule(
                this.controller.fireProjectile, 
                fireInterval, 
                cc.macro.REPEAT_FOREVER, 
                fireInterval 
            );
        }
    }


    handleInput(command, isPressed) {
        if (isPressed) {
            if (command === "MOVE_UP") this.controller.moveUp();
            else if (command === "MOVE_DOWN") this.controller.moveDown();
        }

        if (command === "FIRE" && !isPressed) {
            this.controller.setState(new IdleState(this.controller));
        }
    }
    
    exit() {
        this.controller.unschedule(this.controller.fireProjectile);
    }
}