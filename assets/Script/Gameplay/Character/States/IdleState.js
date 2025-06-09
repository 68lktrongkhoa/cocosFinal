import State from '../../../Common/Patterns/State.js';
import FiringState from './FiringState.js';
import MovingState from './MovingState.js';

export default class IdleState extends State {
    constructor(controller) {
        super();
        this.controller = controller;
    }

    enter() {
        this.controller.spineAnim.setAnimation(0, 'hoverboard', true);
    }
    
    handleInput(command, isPressed) {
        if (command === 'MOVE_UP' || command === 'MOVE_DOWN') {
            this.controller.setState(new MovingState(this.controller, command));
        }
        if (command === "FIRE" && isPressed) {
            this.controller.setState(new FiringState(this.controller));
        }
    }
}