const Emitter = require("Emitter");
const EventKeys = require("EventKeys");
const MainController = require('MainController');
const DataStorageController = require('DataStorageController');
const GameConfig = require('GameConfig');
cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
    },

    onLoad() {
        this.updateScore();
        Emitter.emit(EventKeys.SOUND.CHANGE_CURRENT_BGM,GameConfig.SCENE.LOBBY);
        this.registerEvents();
    },

    onDestroy() {
        this.removeEvents();
    },

    registerEvents() {
        Emitter.registerEvent(EventKeys.UI.UPDATE_SCORE, this.updateScore, this);
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

    updateScore(){
        const score = DataStorageController.getScoreData();
        this.scoreLabel.string = score.toString();
    }
});
