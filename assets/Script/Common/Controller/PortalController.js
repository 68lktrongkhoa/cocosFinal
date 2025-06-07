const MainController = require('MainController');

cc.Class({
    extends: cc.Component,

    onClickLaunchGame() {
        cc.log('Starting game → Loading Scene');
        cc.director.loadScene('LoadingScene');
    },

    onClickTest() {
        MainController.instance.startGame();
    }
});
