const Emitter = require('Emitter');
const Events = require('EventKeys');
const GameConfig = require('GameConfig');

cc.Class({
    extends: cc.Component,

    onLoad() {
        this.registerEvent();
        this.init();
    },

    init() {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;

        this.score = 0;
        this.time = 0;

        this.schedule(this._countTime.bind(this), 1);

        this.scheduleOnce(() => {
            Emitter.emit(Events.GAME.START);
        }, 0.1);
    },

    _countTime() {
        this.time += 1;
        Emitter.emit(Events.UPDATE_UI.TIME, this.time);
    },

    addScore(reward) {
        this.score += reward;
        Emitter.emit(Events.UPDATE_UI.SCORE, this.score);
    },

    getScore(){
        return this.score;
    },

    registerEvent() {
        Emitter.registerEvent(Events.GAME.OVER, this.onGameOver, this);
        Emitter.registerEvent(Events.GAME.ADD_SCORE, this.addScore, this);
    },

    onGameOver() {
        this.node.stopAllActions();
    },

    onDestroy() {
        Emitter.removeEventsByTarget(this);
    }
});
