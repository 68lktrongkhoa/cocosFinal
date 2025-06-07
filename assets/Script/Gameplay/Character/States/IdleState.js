import State from '../../../Common/Patterns/State.js';
import MovingState from './MovingState.js';

export default class IdleState extends State {
    enter() {
    }

    handleInput(command) {
        if (command === 'MOVE_UP' || command === 'MOVE_DOWN') {
            this.controller.setState(new MovingState(this.controller, command));
        }
    }
}