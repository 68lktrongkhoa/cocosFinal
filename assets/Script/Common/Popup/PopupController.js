const Emitter = require("Emitter");
const EventKeys = require("EventKeys");
const GameConfig = require("GameConfig");
const MainController = require('MainController');
cc.Class({
    extends: cc.Component,

    properties: {
        backPanel: cc.Node,
        popupSetting: require("PopupItem"),
        popupHighScore: require("PopupHighScore"),
        isShowing: {
            default: false,
        }
    },

    onLoad() {
        MainController.instance.addPersistRootNode(this.node);
        this.backPanel.active = false;
        this.hideSetting();
        this.hideHighScore();
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

    loadHighScoreData() {
        const dataString = cc.sys.localStorage.getItem(GameConfig.LOCAL_STORAGE.HIGHSCORE_DATA);
        if (dataString) {
            const data = JSON.parse(dataString);
            return data;
        } else {
            return [];
        }
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
