const DataStorageController = require("DataStorageController");
const Emitter = require("Emitter");
const EventKeys = require("EventKeys");
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
        upgradeKey: {
            default: '',
        },
        levelLabel: cc.Label,
        buttonLabel: cc.Label,
        upgradeButton: cc.Button,
    },

    onLoad() {
        this.loadLocalData();
        this.setInfoLabel();
    },

    upgrade(){
        if(this.level < this.maxLevel){
            this.level++;
            this.setScore();
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
        if(this.upgradeCost > DataStorageController.getScoreData()){
            this.upgradeButton.interactable = false;
            this.upgradeButton.node.opacity = 150;
        } else {
            this.upgradeButton.interactable = true;
            this.upgradeButton.node.opacity = 255;
        }
    },

    loadConfigInfo() {},

    loadLocalData() {
        const stat = DataStorageController.getUpgradeStat();
        if (stat[this.upgradeKey] != null) {
            this.level = stat[this.upgradeKey];
        }
        
    },

    saveLocalData() {
        const stat = DataStorageController.getUpgradeStat();
        stat[this.upgradeKey] = this.level;
        DataStorageController.setUpgradeStat(stat);
    },

    setScore(){
        DataStorageController.setScoreData(-this.upgradeCost);
        Emitter.emit(EventKeys.UI.UPDATE_SCORE);
    },
});
