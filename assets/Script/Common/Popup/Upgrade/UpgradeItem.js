const DataStorageController = require("DataStorageController");

cc.Class({
    extends: cc.Component,

    properties: {
        level: {
            type: cc.Integer,
            default: 1,
        },
        upgradeCost: {
            type: cc.Integer,
            default: 500,
        },
        maxLevel: {
            type: cc.Integer,
            default: 9,
        },
        levelLabel: cc.Label,
        buttonLabel: cc.Label,
        upgradeKey: {
            default: '',
        },
    },

    onLoad() {
        this.loadLocalData();
        this.setInfoLabel();
    },

    upgrade(){
        if(this.level < this.maxLevel){
            this.level++;
            this.setInfoLabel();
            this.saveLocalData();
        }
    },

    setInfoLabel(){
        this.loadConfigInfo();
        if (this.level < this.maxLevel) {
            this.buttonLabel.string = this.upgradeCost;
        } else {
            this.buttonLabel.string = "MAX";
        }
        this.levelLabel.string = "LVL " + this.level;
    },

    loadConfigInfo() {},

    loadLocalData() {
        const stat = DataStorageController.getUpgradeStat();
        console.log("loadLocalData", stat);
        if (stat[this.upgradeKey] != null) {
            this.level = stat[this.upgradeKey];
        }
        
    },

    saveLocalData() {
        const stat = DataStorageController.getUpgradeStat();
        stat[this.upgradeKey] = this.level;
        DataStorageController.setUpgradeStat(stat);
    },
});
