const Emitter = require("Emitter");
const EventKeys = require("EventKeys");
cc.Class({
    extends: cc.Component,

    properties: {
        popupSetting: require("PopupItem"),
        isShowing: {
            default: false,
        }
    },

    onLoad() {
        this.hideSetting();
        this.registerEvents();
    },

    onDestroy() {
        this.removeEvents();
    },

    registerEvents(){
        Emitter.registerEvent(EventKeys.POPUP.SHOW_SETTING, this.showSetting, this);
        Emitter.registerEvent(EventKeys.POPUP.HIDE_SETTING, this.hideSetting, this);
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

    setIsShowing(isShowing) {
        this.isShowing = isShowing;
    },

    getIsShowing() {
        return this.isShowing;
    },

    removeEvents(){
        Emitter.removeEvent(EventKeys.POPUP.SHOW_SETTING, this.showSetting);
        Emitter.removeEvent(EventKeys.POPUP.HIDE_SETTING, this.hideSetting);
    },
});
