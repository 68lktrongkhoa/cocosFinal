cc.Class({
    extends: cc.Component,

    properties: {
        orderLabel: cc.Label,
        timeLabel: cc.Label,
        scoreLabel: cc.Label,
    },

    setInfo(highScoreData) {
        this.orderLabel.string = highScoreData.order;
        const minutes = Math.floor(highScoreData.time / 60);
        const seconds = highScoreData.time % 60;
        this.timeLabel.string = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        this.scoreLabel.string = highScoreData.score;
    },
});
