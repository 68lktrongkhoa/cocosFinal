cc.Class({
    extends: cc.Component,
    updateSize(slider) {
        this.node.width = slider.node.width * slider.progress;
    }
});
