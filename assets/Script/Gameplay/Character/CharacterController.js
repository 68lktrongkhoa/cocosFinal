import IdleState from './States/IdleState.js';

cc.Class({
    extends: cc.Component,

    properties: {
        yPositions: {
            default: [],
            type: [cc.Float]
        },
        moveDuration: {
            default: 0.2,
            type: cc.Float
        },
    },

    onLoad() {
        if (this.yPositions.length < 3) {
            this.enabled = false; 
            return;
        }

        this.currentPositionIndex = 1;
        this.node.y = this.yPositions[this.currentPositionIndex];
        
        this.state = null;
        this.setState(new IdleState(this)); 
    },

    handleInput(command) {
        if (this.state) {
            this.state.handleInput(command);
        }
    },

    setState(newState) {
        if (this.state) {
            this.state.exit();
        }
        this.state = newState;
        this.state.enter();
    },
});