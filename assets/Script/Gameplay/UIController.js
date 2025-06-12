const MainController = require('MainController');
const Emitter = require('Emitter');
const Events = require('EventKeys');
const GameConfig = require('GameConfig');
cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        timeLabel: cc.Label,
        gameStartOverlay: cc.Node,
        gameOverOverlay: cc.Node,
        ingameOverlay: cc.Node,
        warningOverlay: cc.Node,
        dangerOverlay: cc.Node,
        healthNode: cc.Node,
        buttonsNode: cc.Node
    },

    onLoad() {
        this.registerEvent();
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

    animateGlow(node) {
        const glow = node.getChildByName('WhiteGlow');
        cc.tween(glow)
            .repeatForever(
                cc.tween()
                    .to(1, { opacity: 255 }, { easing: 'sineOut' })
                    .to(1, { opacity: 0 }, { easing: 'sineIn' })
            )
            .start();
    },

    animateFlags() {
        const banner = this.gameOverOverlay.getChildByName('Banner');
        const leftFlag = banner.getChildByName('LeftFlag');
        const rightFlag = banner.getChildByName('RightFlag');
        const angle = leftFlag.angle;

        this.floatTween(leftFlag, angle, 5, 1);
        this.floatTween(rightFlag, -angle, -5, 1);
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

    onDangerUpdate() {
        this.dangerOverlay.active = true;
        this.dangerOverlay.opacity = 0;

        cc.tween(this.dangerOverlay)
            .to(0.2, { opacity: 255 }, { easing: 'sineOut' })
            .to(0.2, { opacity: 0 }, { easing: 'sineIn' })
            .call(() => {
                this.dangerOverlay.active = false;
            })
            .start();
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
        cc.tween(this.gameOverOverlay).to(1, { opacity: 255 }).start();
    },

    hideIngameOverlay() {
        cc.tween(this.buttonsNode)
            .to(1, { opacity: 0 })
            .start();

        cc.tween(this.ingameOverlay)
            .to(1, { opacity: 0 })
            .start();

        this.buttonsNode.active = false;
        this.ingameOverlay.active = false;
    },

    showIngameOverlay() {
        this.ingameOverlay.active = true;
        this.buttonsNode.active = true;

        this.ingameOverlay.opacity = 0;
        this.buttonsNode.opacity = 0;

        cc.tween(this.ingameOverlay)
            .to(1, { opacity: 255 })
            .start();

        cc.tween(this.buttonsNode)
            .to(1, { opacity: 255 })
            .start();
        Emitter.emit(Events.GAME.START);
    },

    init() {
        this.scoreLabel.string = '0';
        this.timeLabel.string = '00:00';

        this.gameStartOverlay.active = false;
        this.gameStartOverlay.opacity = 255;

        this.gameOverOverlay.active = false;
        this.gameOverOverlay.opacity = 255;

        this.ingameOverlay.active = false;
        this.ingameOverlay.opacity = 255;

        this.gameStartOverlay.active = true;
        this.animateWings();
        this.animateGlow(this.gameStartOverlay);
        this.startCountdown(() => {
            this.hideGameStartOverlay();
            Emitter.emit(Events.GAME.OPENING_DONE);
        });
    },

    onTimerUpdate(seconds) {
        const time = this.formatTimer(seconds);
        this.timeLabel.string = time;
    },

    onGameOver(score, time) {
        const bannerNode = this.gameOverOverlay.getChildByName('Banner');
        const resultNode = this.gameOverOverlay.getChildByName('Result');
        const scoreLabel = resultNode.getChildByName('ScoreLabel').getComponent(cc.Label);
        const timeLabel = resultNode.getChildByName('TimeLabel').getComponent(cc.Label);
        scoreLabel.string = 'Score: ' + score.toString();
        timeLabel.string = 'Time: ' + this.formatTimer(time);
        this.hideIngameOverlay();
        this.displayGameOverOverlay();
        this.animateFlags();
        this.animateGlow(bannerNode);
        Emitter.emit(Events.SOUND.PLAY_SFX, GameConfig.SOUND.VICTORY);
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

    onBossSpawn() {
        this.warningOverlay.active = true;
        this.warningOverlay.opacity = 0;
        this.warningOverlay.stopAllActions();

        cc.tween(this.warningOverlay)
            .repeatForever(
                cc.tween()
                    .to(0.4, { opacity: 255, easing: 'sineInOut' })
                    .delay(0.2)
                    .to(0.4, { opacity: 100, easing: 'sineInOut' })
            )
            .start();

        this.scheduleOnce(() => {
            this.warningOverlay.stopAllActions();
            this.warningOverlay.opacity = 0;
            this.warningOverlay.active = false;
        }, 3);
    },

    onTryAgainClick() {
        Emitter.emit(Events.GAME.TRY_AGAIN);
    },

    onExitClick() {
        MainController.instance.transition('backToLobby');
    },

    registerEvent() {
        Emitter.registerEvent(Events.GAME.INIT, this.init, this);
        Emitter.registerEvent(Events.GAME.PLAYER_ANIMATION_DONE, this.showIngameOverlay, this);
        Emitter.registerEvent(Events.GAME.BOSS_SPAWNED, this.onBossSpawn, this);
        Emitter.registerEvent(Events.GAME.OVER, this.onGameOver, this);
        Emitter.registerEvent(Events.UPDATE_UI.TIME, this.onTimerUpdate, this);
        Emitter.registerEvent(Events.UPDATE_UI.SCORE, this.onScoreUpdate, this);
        Emitter.registerEvent(Events.UPDATE_UI.HEALTH, this.onHealthUpdate, this);
        Emitter.registerEvent(Events.UPDATE_UI.DANGER, this.onDangerUpdate, this);
    },

    onDestroy() {
        Emitter.removeEventsByTarget(this);
    }

});
