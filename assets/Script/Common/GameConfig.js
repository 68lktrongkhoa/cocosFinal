const GameConfig = {
    PORTAL: 'PortalScene',

    SCENE: {
        LOADING: 'LoadingScene',
        LOBBY: 'LobbyScene',
        GAME: 'GameScene',
    },

    PLAYER_DEFAULT: {
        DAMAGE: 10,
    },

    CASTLE_DEFAULT: {
        HP: 3,
    },

    LOCAL_STORAGE: {
        SOUND_DATA: 'soundData',
        HIGHSCORE_DATA: 'highScoreData',
    },

    MONSTER_SPAWN_SCORE: {
        BOSS: [100, 500, 1500, 3000, 5000],
        DRAGON: [50, 250, 750, 1000, 1250, 1750, 2000, 2250, 2500, 2750, 3250, 3500, 3750, 4000, 4250, 4500, 4750]
    }
};

module.exports = GameConfig;
