const Emitter = require('Emitter');
const Events = require('EventKeys');

cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        timeLabel: cc.Label,
        gameStartOverlay: cc.Node,
        gameOverOverlay: cc.Node,
        ingameOverlay: cc.Node,
        healthNode: cc.Node
    },

    onLoad() {
        this.registerEvent();
    },

    setupUI() {
        this.gameOverOverlay.active = false;
        this.hideGameUI();
    },

    playOpeningEffects(callback) {
        this.animateWings();
        this.animateGlow();
        callback && callback();
    },

    animateWings() {
        const wingLeft = this.gameStartOverlay.getChildByName('WingLeft');
        const wingRight = this.gameStartOverlay.getChildByName('WingRight');
        const angle = wingLeft.angle;

        this.floatTween(wingLeft, angle, 5, 1);
        this.floatTween(wingRight, -angle, -5, 1);
    },

    floatTween(node, baseAngle, rotation, time) {
        cc.tween(node)
            .repeatForever(
                cc.tween()
                    .to(time, { angle: baseAngle + rotation }, { easing: 'sineInOut' })
                    .to(time, { angle: baseAngle - rotation }, { easing: 'sineInOut' })
            )
            .start();
    },

    animateGlow() {
        const glow = this.gameStartOverlay.getChildByName('WhiteGlow');
        cc.tween(glow)
            .repeatForever(
                cc.tween()
                    .to(1, { opacity: 255 }, { easing: 'sineOut' })
                    .to(1, { opacity: 0 }, { easing: 'sineIn' })
            )
            .start();
    },

    startCountdown(onFinish) {
        const countdown = ['Battle Start', 'Battle Start', '3', '2', '1'];
        let index = 0;
        const label = this.gameStartOverlay.getChildByName('Label').getComponent(cc.Label);
        const shield = this.gameStartOverlay.getChildByName('Shield');

        cc.tween(this.node)
            .repeat(countdown.length,
                cc.tween()
                    .call(() => {
                        label.string = countdown[index];
                        label.fontSize = index < 2 ? 50 : 100;
                        shield.active = index >= 2;
                        index++;
                    })
                    .delay(1)
            )
            .call(onFinish)
            .start();
    },

    onHealthUpdate(health) {
        this.healthNode.children.forEach((node, index) => {
            const heart = node.getChildByName('IconRed');
            if (index < health) {
                heart.opacity = 255;
            } else {
                heart.opacity = 0;
            }
        })
    },

    showGameStartOverlay() {
        this.gameStartOverlay.active = true;
        this.gameStartOverlay.opacity = 255;
    },

    hideGameStartOverlay() {
        cc.tween(this.gameStartOverlay)
            .to(0.5, { opacity: 0 })
            .call(() => { this.gameStartOverlay.active = false; })
            .start();
    },

    displayGameOverOverlay() {
        this.gameOverOverlay.active = true;
        this.gameOverOverlay.opacity = 0;
        Emitter.emit(Events.GAME.SHOW_FINAL_SCORE);
        cc.tween(this.gameOverOverlay).to(1, { opacity: 255 }).start();
    },

    hideIngameOverlay() {
        cc.tween(this.ingameOverlay)
            .to(1, { opacity: 0 })
            .start();
        this.ingameOverlay.active = false;
    },

    showIngameOverlay() {
        this.ingameOverlay.active = true;
        this.ingameOverlay.opacity = 0;
        cc.tween(this.ingameOverlay)
            .to(1, { opacity: 255 })
            .start();
        Emitter.emit(Events.GAME.START);
    },

    init() {
        cc.log('UIController init');
        this.scoreLabel.string = '0';
        this.timeLabel.string = '00:00';

        this.gameOverOverlay.active = false;
        this.gameStartOverlay.active = false;
        this.ingameOverlay.active = false;

        this.gameStartOverlay.active = true;
        this.animateWings();
        this.animateGlow();
        this.startCountdown(() => {
            this.hideGameStartOverlay();
            Emitter.emit(Events.GAME.OPENING_DONE);
        });
    },

    onTimerUpdate(seconds) {
        const time = this.formatTimer(seconds);
        this.timeLabel.string = time;
    },

    formatTimer(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const mm = minutes < 10 ? '0' + minutes : minutes;
        const ss = secs < 10 ? '0' + secs : secs;
        return `${mm}:${ss}`;
    },

    onScoreUpdate(score) {
        this.scoreLabel.string = score;
    },

    registerEvent() {
        cc.log('UIController registerEvent');
        Emitter.registerEvent(Events.GAME.INIT, this.init, this);
        Emitter.registerEvent(Events.GAME.PLAYER_ANIMATION_DONE, this.showIngameOverlay, this);
        Emitter.registerEvent(Events.UPDATE_UI.TIME, this.onTimerUpdate, this);
        Emitter.registerEvent(Events.UPDATE_UI.SCORE, this.onScoreUpdate, this);
        Emitter.registerEvent(Events.UPDATE_UI.HEALTH, this.onHealthUpdate, this);
    },

    onDestroy() {
        Emitter.removeEventsByTarget(this);
    }

});
