import IdleState from './IdleState.js';

export default class MovingState {
    constructor(controller, direction) {
        this.controller = controller;
        this.moveDirection = direction;
    }

    enter() {
        const currentIndex = this.controller.currentPositionIndex;
        const maxIndex = this.controller.yPositions.length - 1;
        let targetIndex = currentIndex;

        if (this.moveDirection === 'MOVE_UP') {
            targetIndex--;
        } else if (this.moveDirection === 'MOVE_DOWN') {
            targetIndex++;
        }

        targetIndex = Math.max(0, Math.min(targetIndex, maxIndex));

        if (targetIndex === currentIndex) {
            this.controller.setState(new IdleState(this.controller));
            return;
        }

        this.controller.currentPositionIndex = targetIndex;
        const targetY = this.controller.yPositions[targetIndex];

        cc.tween(this.controller.node)
            .to(this.controller.moveDuration, 
                { y: targetY },
                { easing: 'quadOut' } 
            )
            .call(() => {
                this.controller.setState(new IdleState(this.controller));
            })
            .start();
    }
}