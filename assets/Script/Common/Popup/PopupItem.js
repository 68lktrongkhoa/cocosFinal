
cc.Class({
    extends: cc.Component,

    properties: {
        animation: cc.Animation
    },

    onLoad() {
        this.animation = this.getComponent(cc.Animation);
    },

    show(){
        this.playPopupAnimation();
        this.node.active = true;
    },

    hide() {
        this.node.active = false;
    },

    playPopupAnimation(){
        this.animation.play("Popup");
    }
});
