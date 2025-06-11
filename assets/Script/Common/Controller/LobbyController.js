const Emitter = require("Emitter");
const EventKeys = require("EventKeys");
const MainController = require('MainController');
const DataStorageController = require('DataStorageController');
const { removeEventsByTarget } = require("../Event/Emitter");
cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
    },

    onLoad() {
        this.updareScore();
    },

    onDestroy() {
        this.removeEvents();
    },

    registerEvents() {
        Emitter.registerEvent(EventKeys.UI.UPDATE_SCORE, this.updareScore, this);
    },

    removeEvents() {
            Emitter.removeEventsByTarget(this);
    },
    showSettingPopup() {
        Emitter.emit(EventKeys.POPUP.SHOW_SETTING);
    },

    showHighScorePopup() {
        Emitter.emit(EventKeys.POPUP.SHOW_HIGHSCORE);
    },

    showUpgradePopup() {
        Emitter.emit(EventKeys.POPUP.SHOW_UPGRADE);
    },

    playGame(){
        MainController.instance.transition('playGame');
    },

    exitGame(){
        MainController.instance.transition('exitGame');
    },

    updareScore(){
        const score = DataStorageController.getScoreData();
        this.scoreLabel.string = score.toString();
    }
});
