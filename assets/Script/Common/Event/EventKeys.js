
module.exports = {
    POPUP: {
        SHOW_SETTING: 'showSettingPopup',
        SHOW_HIGHSCORE: 'showHighScorePopup',
        SHOW_UPGRADE: 'showUpgradePopup',
        SHOW_PAUSE_SETTING: 'showPauseSettingPopup',
    },
    GAMEPLAY: {
        FIRE_BULLET: 'GAMEPLAY_FIRE_BULLET',
        FIRE_PROJECTILE: 'GAMEPLAY_FIRE_PROJECTILE',
        WEAPON_SWITCHED: 'WEAPON_SWITCHED',
    },

    SOUND:{
        SET_MUSIC_VOLUME: 'setMusicVolume',
        SET_SOUND_VOLUME: 'setSoundVolume',
        PLAY_MUSIC: 'playMusic',
        STOP_MUSIC: 'stopMusic',
        ENABLE_SOUND: 'enableSound',
        PLAY_SFX: 'playSFX',
        CHANGE_CURRENT_BGM: 'changeCurrentBGM',
    },

    UI: {
        UPDATE_SCORE: 'updateScore',
        FADE_IN_WAITING: 'fadeInWaiting',
        FADE_OUT_WAITING: 'fadeOutWaiting',
    },

    GAME: {
        INIT: 'gameInit',
        START: 'gameStart',
        OVER: 'gameOver',
        TRY_AGAIN: 'gameTryAgain',
        ADD_SCORE: 'gameAddScore',
        OPENING_DONE: 'gameOpeningDone',
        BOSS_SPAWNED: 'gameBossSpawned',
    },

    MONSTER: {
        ON_DIE: 'monsterOnDie',
    },

    CASTLE:{
        ON_HIT: 'castleOnHit',
    },

    UPDATE_UI:{
        TIME: 'updateTime',
        SCORE: 'updateScore',
        HEALTH: 'updateHealth',
        DANGER: 'updateDanger'
    },

    MAIN_CONTROLLER: {
        CLEAR: 'clear',
    }
};
