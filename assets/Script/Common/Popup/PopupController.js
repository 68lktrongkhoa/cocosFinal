const Emitter = require("Emitter");
const EventKeys = require("EventKeys");
const MainController = require('MainController');
const DataStorageController = require('DataStorageController');
cc.Class({
    extends: cc.Component,

    properties: {
        backPanel: cc.Node,
        popupSetting: require("PopupItem"),
        popupHighScore: require("PopupItem"),
        popupUpgrade: require("PopupItem"),
        pauseSetting: cc.Node,
        exitButton: cc.Node,
        isShowing: {
            default: false,
        }
    },

    onLoad() {
        MainController.instance.addPersistRootNode(this.node);
        this.backPanel.active = false;
        this.hidePauseSetting();
        this.hideSetting();
        this.hideHighScore();
        this.hideUpgrade();
        this.registerEvents();
    },

    onDestroy() {
        this.removeEvents();
    },

    registerEvents(){
        Emitter.registerEvent(EventKeys.POPUP.SHOW_SETTING, this.showSetting, this);
        Emitter.registerEvent(EventKeys.POPUP.SHOW_PAUSE_SETTING,this.showPauseSetting, this);
        Emitter.registerEvent(EventKeys.POPUP.SHOW_HIGHSCORE, this.showHighScore, this);
        Emitter.registerEvent(EventKeys.POPUP.SHOW_UPGRADE, this.showUpgrade, this);
    },

    showSetting(){
        if(this.getIsShowing()){
            return;
        }
        this.popupSetting.show();
        this.setIsShowing(true);
    },

    hideSetting(){
        this.hidePauseSetting();
        this.popupSetting.hide();
        this.setIsShowing(false);
    },

    showHighScore() {
        if (this.getIsShowing()) {
            return;
        }
        const highScoreData = this.loadHighScoreData(); 
        this.popupHighScore.show(highScoreData);
        this.setIsShowing(true);
    },

    hideHighScore() {
        this.popupHighScore.hide();
        this.setIsShowing(false);
    },

    showUpgrade() {
        if (this.getIsShowing()) {
            return;
        }
        this.popupUpgrade.show();
        this.setIsShowing(true);
    },

    hideUpgrade() {
        this.popupUpgrade.hide();
        this.setIsShowing(false);
    },

    showPauseSetting() {
        this.pauseSetting.active = true;
        this.exitButton.active = false;
        this.showSetting();
    },
 
    hidePauseSetting() {
        this.pauseSetting.active = false;
        this.exitButton.active = true;
    },

    loadHighScoreData() {
        return DataStorageController.getHighScoreData();
    },

    setIsShowing(isShowing) {
        this.backPanel.active = isShowing;
        this.isShowing = isShowing;
    },

    getIsShowing() {
        return this.isShowing;
    },

    removeEvents(){
        Emitter.removeEventsByTarget(this);
    },
});
