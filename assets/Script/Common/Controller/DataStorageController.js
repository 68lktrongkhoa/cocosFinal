const MainController = require('MainController');
const GameConfig = require("GameConfig");

const DataStorageController = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,

        getSoundData() {
            const dataString = cc.sys.localStorage.getItem(GameConfig.LOCAL_STORAGE.SOUND_DATA);
            if (dataString) {
                return JSON.parse(dataString);
            } else {
                return {
                    MUSIC_ENABLED: true,
                    MUSIC_VOLUME: 1,
                    SOUND_ENABLED: true,
                    SOUND_VOLUME: 1
                };
            }
        },

        setSoundData(data) {
            cc.sys.localStorage.setItem(GameConfig.LOCAL_STORAGE.SOUND_DATA, JSON.stringify(data));
        },

        getHighScoreData() {
            const dataString = cc.sys.localStorage.getItem(GameConfig.LOCAL_STORAGE.HIGHSCORE_DATA);
            if (dataString) {
                return JSON.parse(dataString);
            } else {
                return [];
            }
        },

        setHighScoreData(score, time) {
            const data = this.getHighScoreData();
            data.push({ score, time });
            data.sort((a, b) => {
                if (b.time !== a.time) {
                    return b.time - a.time;
                }
                return b.score - a.score;
            });
            cc.sys.localStorage.setItem(GameConfig.LOCAL_STORAGE.HIGHSCORE_DATA, JSON.stringify(data.slice(0, GameConfig.LOCAL_STORAGE.HIGHSCORE_MAX_LENGTH)));
        },

        getUpgradeStat() {
            const dataString = cc.sys.localStorage.getItem(GameConfig.LOCAL_STORAGE.UPGRADE_STAT);
            if (dataString) {
                return JSON.parse(dataString);
            } else {
                return {
                    castle: 1,
                    skill: 1,
                    laser: 1,
                    bullet: 1
                };
            }
        },

        setUpgradeStat(stat) {
            cc.sys.localStorage.setItem(GameConfig.LOCAL_STORAGE.UPGRADE_STAT, JSON.stringify(stat));
        },

        getScoreData() {
            const dataString = cc.sys.localStorage.getItem(GameConfig.LOCAL_STORAGE.SCORE_DATA);
            if (dataString) {
                return JSON.parse(dataString);
            } else {
                return 0;
            }
        },

        setScoreData(score) {
            const currentScore = this.getScoreData();
            const newScore = currentScore + score;
            cc.sys.localStorage.setItem(GameConfig.LOCAL_STORAGE.SCORE_DATA, JSON.stringify(newScore));
        }
    },

    onLoad() {
        MainController.instance.addPersistRootNode(this.node);
        if (DataStorageController.instance == null) {
            DataStorageController.instance = this;
        } else {
            this.destroy();
        }
    },
});

module.exports = DataStorageController;
