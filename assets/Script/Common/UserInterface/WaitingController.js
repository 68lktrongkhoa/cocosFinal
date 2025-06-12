const Emitter = require('Emitter');
const EventKeys = require('EventKeys');
const MainController = require('MainController');

cc.Class({
    extends: cc.Component,

    properties: {
        waitingOverlay: cc.Node,
    },

    onLoad() {
        MainController.instance.addPersistRootNode(this.node);
        this.registerEvents();
    },

    onDestroy() {
        this.removeEvents();
    },

    registerEvents() {
        Emitter.registerEvent(EventKeys.UI.FADE_IN_WAITING, this.fadeInOverlay, this);
        Emitter.registerEvent(EventKeys.UI.FADE_OUT_WAITING, this.fadeOutOverlay, this);
    },
    
    removeEvents() {
        Emitter.removeEventsByTarget(this);
    },

    fadeOutOverlay(){
        this.waitingOverlay.runAction(cc.fadeOut(0.5));
    },

    fadeInOverlay(){
        this.waitingOverlay.runAction(cc.fadeIn(0.5));
    }
});
