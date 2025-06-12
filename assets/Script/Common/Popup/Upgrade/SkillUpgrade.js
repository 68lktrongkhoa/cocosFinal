const GameConfig = require("GameConfig");
cc.Class({
    extends: require('UpgradeItem'),

    properties: {
        cooldownLabel: cc.Label,
        cooldown: {
            type: cc.Integer,
            default: 1,
        },
    },

    onLoad() {
        this.upgradeKey = 'skill';
        this._super();
    },

    setInfoLabel(){
        this._super();
        this.cooldownLabel.string = this.cooldown;
    },

    loadConfigInfo(){
        const upgradeData = GameConfig.STAT.SKILL.STUN;
        this.maxLevel = upgradeData.length;
        this.upgradeCost = upgradeData[this.level - 1].cost;
        this.cooldown = upgradeData[this.level - 1].cooldown;
    },
});
