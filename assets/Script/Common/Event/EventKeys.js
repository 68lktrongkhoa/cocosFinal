module.exports = {
    POPUP: {
        SHOW_SETTING: 'showSettingPopup',
        HIDE_SETTING: 'hideSettingPopup',
        SHOW_HIGHSCORE: 'showHighScorePopup',
        HIDE_HIGHSCORE: 'hideHighScorePopup',
    },
    GAMEPLAY: {
        FIRE_BULLET: 'GAMEPLAY_FIRE_BULLET',
        FIRE_PROJECTILE: 'GAMEPLAY_FIRE_PROJECTILE',
    },

    SOUND:{
        SET_MUSIC_VOLUME: 'setMusicVolume',
        SET_SOUND_VOLUME: 'setSoundVolume',
        PLAY_MUSIC: 'playMusic',
        STOP_MUSIC: 'stopMusic',
        ENABLE_SOUND: 'enableSound',
        PLAY_ONLCICK_SOUND: 'playOnclickSound',
    },

    GAME: {
        INIT: 'gameInit',
        START: 'gameStart',
        OVER: 'gameOver',
        ADD_SCORE: 'gameAddScore',
        OPENING_DONE: 'gameOpeningDone',
    },

    MONSTER: {
        ON_DIE: 'monsterOnDie',
    },

    UPDATE_UI:{
        TIME: 'updateTime',
        SCORE: 'updateScore',
        HEALTH: 'updateHealth',
    }
};
