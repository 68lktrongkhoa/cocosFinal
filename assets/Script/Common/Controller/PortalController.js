const MainController = require('MainController');

cc.Class({
    extends: cc.Component,

    onClickLaunchGame() {
        cc.director.loadScene('LoadingScene');
    },

    onClickTest() {
        MainController.instance.startGame();
    }
});
