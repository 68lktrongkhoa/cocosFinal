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
        firePoint: {
            default: null,
            type: cc.Node
        },

        bulletController: {
            default: null,
            type: require('BulletController')
        },

        fireRate: {
            default: 5,
            type: cc.Float,
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

    update(dt) {
        if (this.state && this.state.update) {
            this.state.update(dt);
        }
    },

    handleInput(command, isPressed) {
        if (this.state) {
            this.state.handleInput(command, isPressed);
        }
    },

    fire() {
        if (!this.bulletController || !this.firePoint) {
            console.warn("Have not BulletController or FirePoint!");
            return;
        }

        const shootDirection = this.node.scaleX > 0 ? cc.v2(1, 0) : cc.v2(-1, 0);
        const firePointWorldPos = this.firePoint.parent.convertToWorldSpaceAR(this.firePoint.position);
        const firePointNodePos = this.bulletController.node.parent.convertToNodeSpaceAR(firePointWorldPos);

        this.bulletController.getBullet(firePointNodePos, shootDirection);
    },

    setState(newState) {
        if (this.state) {
            this.state.exit();
        }
        this.state = newState;
        this.state.enter();
    },
});