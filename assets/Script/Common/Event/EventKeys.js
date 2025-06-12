
module.exports = {
    POPUP: {
        SHOW_SETTING: 'showSettingPopup',
        SHOW_HIGHSCORE: 'showHighScorePopup',
        SHOW_UPGRADE: 'showUpgradePopup',
        SHOW_PAUSE_SETTING: 'showPauseSettingPopup',
    },
    GAMEPLAY: {
        FIRE_BULLET: 'gameplayFireBullet',
        FIRE_PROJECTILE: 'gameplayFireProjectile',
        WEAPON_SWITCHED: 'weaponSwitched',
    },

    SOUND: {
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
        PLAYER_ANIMATION_DONE: 'gamePlayerAnimationDone',
        BUFF_SELECTED: 'gameBuffSelected',
        BUFF_DAMAGE_BONUS: 'gameBuffDamageBonus',
        BUFF_SCORE_BONUS: 'gameBuffScoreBonus',
        ON_GAME_OVER: 'gameOnGameOver'
    },

    MONSTER: {
        ON_DIE: 'monsterOnDie',
    },

    CASTLE: {
        ON_HIT: 'castleOnHit',
    },

    UPDATE_UI: {
        TIME: 'updateTime',
        SCORE: 'updateScore',
        HEALTH: 'updateHealth',
        DANGER: 'updateDanger',
        DANGER: 'updateDanger',
        BUFF_SELECTION: 'updateBuffSelection'
    },

    MAIN_CONTROLLER: {
        CLEAR: 'clear',
    }
};
