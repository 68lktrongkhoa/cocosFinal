const Emitter = require('Emitter');
const EventKeys = require('EventKeys');
cc.Class({
    extends: cc.Component,

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    },

    onClick(event) {
        
        Emitter.emit(EventKeys.SOUND.PLAY_ONCLICK_SOUND);
    },

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    },
});
