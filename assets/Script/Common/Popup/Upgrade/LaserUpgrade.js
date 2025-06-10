const GameConfig = require("GameConfig");
cc.Class({
    extends: require('UpgradeItem'),

    properties: {
        damageLabel: cc.Label,
        reloadLabel: cc.Label,
        damage: {
            type: cc.Integer,
            default: 1,
        },
        reload: {
            type: cc.Float,
            default: 1.0,
        },
    },

    setInfoLabel(){
        this._super();
        this.damageLabel.string = this.damage;
        this.reloadLabel.string = this.reload;
    },

    loadConfigInfo(){
        const upgradeData = GameConfig.STAT.GUN.LASER;
        this.maxLevel = upgradeData.length;
        this.upgradeCost = upgradeData[this.level - 1].cost;
        this.damage = upgradeData[this.level - 1].damage;
        this.reload = upgradeData[this.level - 1].reload;
    },
});
