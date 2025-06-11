const GameConfig = {
    PORTAL: 'PortalScene',

    SCENE: {
        LOADING: 'LoadingScene',
        LOBBY: 'LobbyScene',
        GAME: 'GameScene',
    },

    LOCAL_STORAGE: {
        SOUND_DATA: 'soundData',
        HIGHSCORE_DATA: 'highScoreData',
        SCORE_DATA: 'scoreData',
        HIGHSCORE_MAX_LENGTH: 5,
    },

    STAT: {
        GUN: {
            BULLET: [
                { level: 1, damage: 10, reload: 2, cost: 500 },
                { level: 2, damage: 20, reload: 2, cost: 1000 },
                { level: 3, damage: 20, reload: 1.75, cost: 2000 },
                { level: 4, damage: 30, reload: 1.75, cost: 3000 },
                { level: 5, damage: 40, reload: 1.75, cost: 4000 },
                { level: 6, damage: 50, reload: 1.5, cost: 5000 },
                { level: 7, damage: 60, reload: 1.5, cost: 5000 },
                { level: 8, damage: 60, reload: 1.5, cost: 5000 },
                { level: 9, damage: 60, reload: 1.25, cost: 0 }
            ],

            LASER: [
                { level: 1, damage: 20, reload: 5, cost: 500 },
                { level: 2, damage: 30, reload: 5, cost: 1000 },
                { level: 3, damage: 40, reload: 5, cost: 2000 },
                { level: 4, damage: 45, reload: 4, cost: 3000 },
                { level: 5, damage: 55, reload: 4, cost: 4000 },
                { level: 6, damage: 65, reload: 4, cost: 5000 },
                { level: 7, damage: 70, reload: 3, cost: 5000 },
                { level: 8, damage: 80, reload: 3, cost: 5000 },
                { level: 9, damage: 90, reload: 3, cost: 0 }
            ]
        },

        CASTLE: [
            { level: 1, health: 1, cost: 1000 },
            { level: 2, health: 2, cost: 2000 },
            { level: 3, health: 3, cost: 3000 },
            { level: 4, health: 4, cost: 4000 },
            { level: 5, health: 5, cost: 5000 },
            { level: 6, health: 6, cost: 0 },
        ],

        SKILL: {
            SWITCH_GUN:[
                { level: 1, cooldown: 5, cost: 0 },
            ],
            STUN: [
                { level: 1, cooldown: 10, duration: 1, cost: 1000 },
                { level: 2, cooldown: 9.5, duration: 1, cost: 2000 },
                { level: 3, cooldown: 9.5, duration: 1.5, cost: 3000 },
                { level: 4, cooldown: 9, duration: 1.5, cost: 4000 },
                { level: 5, cooldown: 8.5, duration: 1.5, cost: 5000 },
                { level: 6, cooldown: 8, duration: 1.5, cost: 5000 },
                { level: 7, cooldown: 8, duration: 2, cost: 5000 },
                { level: 8, cooldown: 7.5, duration: 2, cost: 5000 },
                { level: 9, cooldown: 7, duration: 2, cost: 0 }
            ]
        }
    }
};

module.exports = GameConfig;
