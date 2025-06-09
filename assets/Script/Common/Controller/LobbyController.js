const Emitter = require("Emitter");
const EventKeys = require("EventKeys");
cc.Class({
    extends: cc.Component,

    showSettingPopup(){
        Emitter.emit(EventKeys.POPUP.SHOW_SETTING);
    },

    hideSettingPopup(){
        Emitter.emit(EventKeys.POPUP.HIDE_SETTING);
    },
});
