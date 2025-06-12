cc.Class({
    extends: cc.Component,

    properties: {
        slider: cc.Slider,
    },

    update () {
        this.node.width = this.slider.node.width * this.slider.progress;
    }
});
