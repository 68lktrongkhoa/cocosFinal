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

        fireRate: {
            default: 5,
            type: cc.Float,
        },
        spineAnim: {
            default: null,
            type: sp.Skeleton,
        },
    },

    onLoad() {
        this.spineAnim.setCompleteListener(this.onSpineAnimationComplete.bind(this));

        this.currentPositionIndex = 1;
        this.node.y = this.yPositions[this.currentPositionIndex];

        this.state = null;
        this.spineAnim.setAnimation(0, 'portal', false);
    },
    onSpineAnimationComplete(trackEntry) {
        const animName = trackEntry.animation.name;

        if (animName === 'portal') {
            this.setState(new IdleState(this));
        }
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

    fireBullet() {
        this.spineAnim.setAnimation(1, 'shoot', false);

        const shootDirection = this.node.scaleX > 0 ? cc.v2(1, 0) : cc.v2(-1, 0);
        const firePointWorldPos = this.firePoint.parent.convertToWorldSpaceAR(this.firePoint.position);
        
        this.node.emit('fire-bullet', {
            position: firePointWorldPos,
            direction: shootDirection
        });
    },

    setState(newState) {
        if (this.state) {
            this.state.exit();
        }
        this.state = newState;
        this.state.enter();
    },
    onDestroy() {
        if (this.spineAnim) {
            this.spineAnim.setCompleteListener(null);
        }
    }
});