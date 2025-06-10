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
        isShowing: {
            default: false,
        }
    },

    onLoad() {
        MainController.instance.addPersistRootNode(this.node);
        this.backPanel.active = false;
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
        Emitter.registerEvent(EventKeys.POPUP.HIDE_SETTING, this.hideSetting, this);
        Emitter.registerEvent(EventKeys.POPUP.SHOW_HIGHSCORE, this.showHighScore, this);
        Emitter.registerEvent(EventKeys.POPUP.HIDE_HIGHSCORE, this.hideHighScore, this);
        Emitter.registerEvent(EventKeys.POPUP.SHOW_UPGRADE, this.showUpgrade, this);
        Emitter.registerEvent(EventKeys.POPUP.HIDE_UPGRADE, this.hideUpgrade, this);
    },

    showSetting(){
        if(this.getIsShowing()){
            return;
        }
        this.popupSetting.show();
        this.setIsShowing(true);
    },

    hideSetting(){
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
