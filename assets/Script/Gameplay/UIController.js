const Emitter = require('Emitter');
const Events = require('EventKeys');

cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        timeLabel: cc.Label,
    },

    onLoad() {
        this.registerEvent();
        this.init();
    },

    init() {
        this.scoreLabel.string = 'Score: 0';
        this.timeLabel.string = 'Time: 0';
    },

    onTimeUpdate(time) {
        this.timeLabel.string = 'Time: ' + time;
    },

    onScoreUpdate(score) {
        this.scoreLabel.string = 'Score: ' + score;
    },

    registerEvent() {
        Emitter.registerEvent(Events.UPDATE_UI.TIME, this.onTimeUpdate, this);
        Emitter.registerEvent(Events.UPDATE_UI.SCORE, this.onScoreUpdate, this);
    },

    onDestroy() {
        Emitter.removeEventsByTarget(this);
    }

});
