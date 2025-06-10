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

    STAT: {
        GUN: {
            BULLET: [
                {level: 1, damage: 10, reload: 2, cost: 500},
                {level: 2, damage: 20, reload: 2, cost: 1000},
                {level: 3, damage: 30, reload: 2, cost: 2000},
                {level: 4, damage: 40, reload: 2, cost: 3000},
                {level: 5, damage: 50, reload: 2, cost: 4000},
                {level: 6, damage: 60, reload: 2, cost: 5000},
                {level: 7, damage: 70, reload: 2, cost: 6000},
                {level: 8, damage: 80, reload: 2, cost: 7000},      
                {level: 9, damage: 90, reload: 2, cost: 0}
            ],
            LASER: [
                {level: 1, damage: 5, reload: 5, cost: 500},
                {level: 2, damage: 7, reload: 5, cost: 1000},
                {level: 3, damage: 10, reload: 5, cost: 0},
            ]
        },

        CASTLE: [
            {level: 1, health: 1, cost: 1000},
            {level: 2, health: 2, cost: 2000},
            {level: 3, health: 3, cost: 3000},
            {level: 4, health: 4, cost: 5000},
            {level: 5, health: 5, cost: 8000},
            {level: 6, health: 6, cost: 0},
        ],

        SKILL: {
            STUN: [
                {level: 1, cooldown: 10, cost: 1000},
                {level: 2, cooldown: 9, cost: 2000},
                {level: 3, cooldown: 8, cost: 3000},
                {level: 4, cooldown: 7, cost: 4000},
                {level: 5, cooldown: 6, cost: 5000},
                {level: 6, cooldown: 5, cost: 6000},
                {level: 7, cooldown: 4, cost: 7000},
                {level: 8, cooldown: 3, cost: 8000},
                {level: 9, cooldown: 2, cost: 0}
            ]
        }
    }
};

module.exports = GameConfig;
