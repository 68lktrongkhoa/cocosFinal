import IdleState from './States/IdleState.js';
const Emitter = require('./Emitter'); 
const EventKey = require('./EventKeys');
const ProjectileController = require('ProjectileController');

cc.Class({
    extends: cc.Component,

    properties: {
        yPositions: { default: [], type: [cc.Float] },
        moveDuration: { default: 0.2, type: cc.Float },
        firePoint: { default: null, type: cc.Node },
        spineAnim: { default: null, type: sp.Skeleton },
        projectileController: {
            default: null,
            type: ProjectileController
        }
    },

    onLoad() {
        this.spineAnim.setCompleteListener(this.onSpineAnimationComplete.bind(this));

        this.currentPositionIndex = 1;
        this.node.y = this.yPositions[this.currentPositionIndex];

        this.state = null;
        this._fireCooldown = 0;
        this.spineAnim.setAnimation(0, 'portal', false);
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
        if (this._fireCooldown > 0) {
            this._fireCooldown -= dt;
        }
        if (this.state && this.state.update) {
            this.state.update(dt);
        }
    },

    getFireInterval() {
        if (this.projectileController) {
            return this.projectileController.getCurrentFireInterval();
        }
        return 0;
    },

    handleInput(command, isPressed) {
        if (command === "FIRE") {
            this.isFireButtonPressed = isPressed;
        }
        if (this.state && this.state.handleInput ) {
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

    tryToFire() {
        if (this._fireCooldown > 0) {
            return;
        }
        this.fireProjectile();
        this._fireCooldown = this.getFireInterval();
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