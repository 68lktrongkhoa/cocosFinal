cc.Class({
    extends: cc.Component,

    properties: {
        loopingTime: {
            default: 8,
            type: cc.Float
        },
        playOnceChainLength: {
            default: 2,
            type: cc.Integer
        },

        loopingAnimations: {
            default: [],
            type: [cc.String],
        },

        animationsToExclude: {
            default: [],
            type: [cc.String],
        },
    },

    onLoad() {
        this._spine = this.getComponent(sp.Skeleton);
        this._isInitialized = false;
        this._loopingAnims = [];
        this._playOnceAnims = [];

        this._isInLoopingPhase = true;
        this._playOnceCounter = 0;

        if (this.loopingAnimations.length === 0) {
            this.loopingAnimations = ['idle', 'walk', 'run', 'hoverboard'];
        }
        if (this.animationsToExclude.length === 0) {
            this.animationsToExclude = ['death', 'portal'];
        }
        this.node.on(cc.Node.EventType.TOUCH_END, this._triggerNextAnimation, this);
    },

    update() {
        if (!this._isInitialized && this._spine && this._spine.skeletonData) {
            this._initialize();
        }
    },

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_END, this._triggerNextAnimation, this);
        this.unscheduleAllCallbacks();
    },

    _triggerNextAnimation() {
        if (!this._isInitialized) return;

        this.unscheduleAllCallbacks();
        this._spine.setCompleteListener(null);

        if (this._isInLoopingPhase) {
            this._executeLoopingAnimation();
            this._isInLoopingPhase = false;
        } else {
            this._executePlayOnceAnimation();
            this._playOnceCounter++;
            if (this._playOnceCounter >= this.playOnceChainLength) {
                this._isInLoopingPhase = true;
                this._playOnceCounter = 0;
            }
        }
    },

    _executeLoopingAnimation() {
        if (this._loopingAnims.length === 0) {
            cc.warn("There is no LOOP animation to run. Skip this step.");
            this._isInLoopingPhase = false;
            this._triggerNextAnimation();
            return;
        }
        const animName = this._loopingAnims[Math.floor(Math.random() * this._loopingAnims.length)];
        this._spine.setAnimation(0, animName, true);
        this.scheduleOnce(this._triggerNextAnimation, this.loopingTime);
    },

    _executePlayOnceAnimation() {
        if (this._playOnceAnims.length === 0) {
            cc.warn("There is no ONE RUN animation to run. Skip this step.");
            this._isInLoopingPhase = true;
            this._triggerNextAnimation();
            return;
        }
        const animName = this._playOnceAnims[Math.floor(Math.random() * this._playOnceAnims.length)];
        this._spine.setAnimation(0, animName, false);
        this._spine.setCompleteListener(() => {
            this._triggerNextAnimation();
        });
    },

    _initialize() {
        this._isInitialized = true;
        this._populateAndCategorizeAnimations();
        this._triggerNextAnimation();
    },

    _populateAndCategorizeAnimations() {
        const allAnims = Object.keys(this._spine.skeletonData.skeletonJson.animations);
        const availableAnims = allAnims.filter(animName => !this.animationsToExclude.includes(animName));
        availableAnims.forEach(animName => {
            if (this.loopingAnimations.includes(animName)) {
                this._loopingAnims.push(animName);
            } else {
                this._playOnceAnims.push(animName);
            }
        });
    },
});