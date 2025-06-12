const GameConfig = require('GameConfig');
const MainController = require('MainController');

cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: {
            default: null,
            type: cc.ProgressBar
        }
    },

    onLoad() {
        const sceneList = Object.values(GameConfig.SCENE).filter(scene => scene !== GameConfig.SCENE.LOADING);

        const totalScenes = sceneList.length;
        let scenesLoaded = 0;
        let progressMap = {};

        sceneList.forEach(sceneName => {
            progressMap[sceneName] = 0;

            cc.director.preloadScene(sceneName,
                (completedCount, totalCount, item) => {
                    progressMap[sceneName] = completedCount / totalCount;

                    let totalProgress = 0;
                    for (let scene in progressMap) {
                        totalProgress += progressMap[scene];
                    }

                    let overallProgress = totalProgress / totalScenes;
                    if (overallProgress > this.progressBar.progress) {
                        this.progressBar.progress = overallProgress;
                    }
                }, () => {
                    progressMap[sceneName] = 1;
                    scenesLoaded++;
                    if (scenesLoaded === totalScenes) {
                        MainController.instance.transition('startGame');
                    }
                });
        });
    },

    onDestroy() {
    }
});
