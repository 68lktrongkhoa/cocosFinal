const GameConfig = require("GameConfig");
cc.Class({
    extends: require('UpgradeItem'),

    properties: {
        healthLabel: cc.Label,
        health: {
            type: cc.Integer,
            default: 1,
        },
    },

    onLoad() {
        this.upgradeKey = 'castle';
        this._super();
    },

    setInfoLabel(){
        this._super();
        this.healthLabel.string = this.health;
    },

    loadConfigInfo(){
        const upgradeData = GameConfig.STAT.CASTLE;
        this.maxLevel = upgradeData.length;
        this.upgradeCost = upgradeData[this.level - 1].cost;
        this.health = upgradeData[this.level - 1].health;
    },
});
