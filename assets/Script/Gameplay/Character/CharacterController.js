import IdleState from './States/IdleState.js';
const Emitter = require('../../Common/Event/Emitter'); 
const EventKey = require('../../Common/Event/EventKeys');

cc.Class({
    extends: cc.Component,

    properties: {
        yPositions: { default: [], type: [cc.Float] },
        moveDuration: { default: 0.2, type: cc.Float },
        firePoint: { default: null, type: cc.Node },
        fireRate: { default: 10, type: cc.Float },
        spineAnim: { default: null, type: sp.Skeleton },
        projectileController: {
            default: null,
            type: require('ProjectileController')
        }
    },

    onLoad() {
        this.spineAnim.setCompleteListener(this.onSpineAnimationComplete.bind(this));

        this.currentPositionIndex = 1;
        this.node.y = this.yPositions[this.currentPositionIndex];

        this.state = null;
        this.spineAnim.setAnimation(0, 'portal', false);
        
        if (this.fireRate > 0) {
            this._fireInterval = 1 / this.fireRate;
        } else {
            this._fireInterval = 0;
        }
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

    getFireInterval() {
        return this._fireInterval;
    },

    handleInput(command, isPressed) {
        if (this.state) {
            this.state.handleInput(command, isPressed);
        }
    },

    fireProjectile() {
        const projectileType = this.projectileController.getCurrentProjectileType();
        
        let animName = (projectileType === 'laser') ? 'shoot_special' : 'shoot';
        this.spineAnim.setAnimation(1, animName, false);

        const shootDirection = this.node.scaleX > 0 ? cc.v2(1, 0) : cc.v2(-1, 0);
        const firePointWorldPos = this.firePoint.parent.convertToWorldSpaceAR(this.firePoint.position);
        
        Emitter.emit(EventKey.GAMEPLAY.FIRE_BULLET, {
            position: firePointWorldPos,
            direction: shootDirection
        });
    },
    
    moveUp() {
        if (this.currentPositionIndex <= 0) return;
        this.currentPositionIndex--;
        cc.tween(this.node).to(this.moveDuration, { y: this.yPositions[this.currentPositionIndex] }).start();
    },

    moveDown() {
        if (this.currentPositionIndex >= this.yPositions.length - 1) return;
        this.currentPositionIndex++;
        cc.tween(this.node).to(this.moveDuration, { y: this.yPositions[this.currentPositionIndex] }).start();
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