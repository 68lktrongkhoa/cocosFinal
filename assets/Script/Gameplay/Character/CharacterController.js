import IdleState from './States/IdleState.js';
import StunnedState from './States/StunnedState.js';
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
        cc.director.getCollisionManager().enabled = true;
    },

    onCollisionEnter(other, self) {
        if (other.node.group === 'Enemy') {
            this.getStunned();
        }
    },

    getStunned() {
        if (this.state instanceof StunnedState) {
            return;
        } else {
            this.setState(new StunnedState(this));
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
        
        this.spineAnim.setAnimation(1, 'shoot', false);

        const shootDirection = this.node.scaleX > 0 ? cc.v2(1, 0) : cc.v2(-1, 0);
        const firePointWorldPos = this.firePoint.parent.convertToWorldSpaceAR(this.firePoint.position);
        
        Emitter.emit(EventKey.GAMEPLAY.FIRE_PROJECTILE, {
            type: projectileType,
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
        if (this.state && this.state.exit) {
            this.state.exit();
        }
        this.state = newState;
        if (this.state && this.state.enter) {
            this.state.enter();
        }
    },
    
    onDestroy() {
        if (this.spineAnim) {
            this.spineAnim.setCompleteListener(null);
        }
    }
});