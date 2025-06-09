const Emitter = require("Emitter");
const EventKeys = require("EventKeys");
const MainController = require('MainController');
cc.Class({
    extends: cc.Component,

    showSettingPopup(){
        Emitter.emit(EventKeys.POPUP.SHOW_SETTING);
    },

    hideSettingPopup(){
        Emitter.emit(EventKeys.POPUP.HIDE_SETTING);
    },

    showHighScorePopup() {
        Emitter.emit(EventKeys.POPUP.SHOW_HIGHSCORE);
    },

    hideHighScorePopup() {
        Emitter.emit(EventKeys.POPUP.HIDE_HIGHSCORE);
    },

    playGame(){
        MainController.instance.transition('playGame');
    },

    exitGame(){
        MainController.instance.transition('exitGame');
    },
});
