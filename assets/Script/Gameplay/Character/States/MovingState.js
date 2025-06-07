import State from '../../../Common/Patterns/State.js';
import IdleState from './IdleState.js';

export default class MovingState extends State {

    constructor(controller, direction) {
        super(controller);
        this.moveDirection = direction;
    }

    enter() {
        let targetIndex = this.controller.currentPositionIndex;
        
        if (this.moveDirection === 'MOVE_UP' && this.controller.currentPositionIndex > 0) {
            targetIndex--;
        } else if (this.moveDirection === 'MOVE_DOWN' && this.controller.currentPositionIndex < this.controller.yPositions.length - 1) {
            targetIndex++;
        } else {
            this.controller.setState(new IdleState(this.controller));
            return;
        }

        this.controller.currentPositionIndex = targetIndex;
        const targetY = this.controller.yPositions[this.controller.currentPositionIndex];

        
        cc.tween(this.controller.node)
            .to(this.controller.moveDuration, { position: cc.v3(this.controller.node.x, targetY, 0) }, { easing: 'quadOut' })
            .call(() => {
                
                this.controller.setState(new IdleState(this.controller));
            })
            .start();
    }

    handleInput(command) {
    }
}