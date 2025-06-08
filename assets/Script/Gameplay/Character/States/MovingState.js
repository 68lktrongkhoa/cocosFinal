import State from '../../../Common/Patterns/State.js';
import IdleState from './IdleState.js';

export default class MovingState extends State {

    constructor(controller, direction) {
        super(controller);
        this.moveDirection = direction;
    }

    enter() {
        const currentIndex = this.controller.currentPositionIndex;
        const maxIndex = this.controller.yPositions.length - 1;
        let targetIndex = currentIndex;

        if (this.moveDirection === 'MOVE_UP') {
            targetIndex = currentIndex - 1;
        } else if (this.moveDirection === 'MOVE_DOWN') {
            targetIndex = currentIndex + 1;
        }

        targetIndex = Math.max(0, Math.min(targetIndex, maxIndex));

        if (targetIndex === currentIndex) {
            this.controller.setState(new IdleState(this.controller));
            return;
        }

        this.controller.currentPositionIndex = targetIndex;
        const targetY = this.controller.yPositions[targetIndex];

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