const Emitter = require('Emitter');
const EventKeys = require('EventKeys');
const GameConfig = require('GameConfig');
cc.Class({
    extends: cc.Component,

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    },

    onClick() {
        Emitter.emit(EventKeys.SOUND.PLAY_SFX, GameConfig.SOUND.CLICK);
    },

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    },
});
