const Emitter = require('Emitter');
const Events = require('EventKeys');
const GameConfig = require('GameConfig');

cc.Class({
    extends: cc.Component,

    onLoad() {
        this.registerEvent();
        this.initCollision();
        this.initGame();
    },

    initCollision() {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    initGame() {
        this.isGameStart = false;
        this.hp = GameConfig.STAT.CASTLE[0].hp;
        Emitter.emit(Events.GAME.INIT);
        Emitter.emit(Events.UPDATE_UI.HEALTH, this.hp);
    },

    addScore(reward) {
        this.score += reward;
        Emitter.emit(Events.UPDATE_UI.SCORE, this.score);
    },

    getScore() {
        return this.score;
    },

    registerEvent() {
        Emitter.registerEvent(Events.GAME.START, this.onGameStart, this);
        Emitter.registerEvent(Events.GAME.OPENING_DONE, this.onInitPlayerAnimation, this);
        Emitter.registerEvent(Events.GAME.OVER, this.onGameOver, this);
        Emitter.registerEvent(Events.GAME.ADD_SCORE, this.addScore, this);
    },

    onInitPlayerAnimation(){
        Emitter.emit(Events.GAME.PLAYER_ANIMATION_DONE);
    },

    onGameStart() {
        this.elapsed = 0;
        this.time = 0;
        this.score = 0;
        this.isGameStart = true;
    },

    onGameOver() {
        this.node.stopAllActions();
    },

    update(dt) {
        if (this.isGameStart) {
            this.elapsed += dt;
            if (this.elapsed >= 1) {
                this.time += Math.floor(this.elapsed);
                this.elapsed %= 1;
                Emitter.emit(Events.UPDATE_UI.TIME, this.time);
            }
        }
    },

    onDestroy() {
        Emitter.removeEventsByTarget(this);
    }
});
