const basePath = 'Sprite/Monster/';

const MonsterConfig = {
    DIFFICULTY: {
        scale: 1.1,
        step: 50
    },

    BASE_STAT: {
        hp: 50,
        speed: 5,
        reward: 5

    },

    MOB: {
        hpScale: 1,
        speedScale: 8,
        rewardScale: 1,
        scale: 0.4,
        sprite: basePath + 'Mob',
    },

    ELITE: {
        hpScale: 2,
        speedScale: 4,
        rewardScale: 2,
        scale: 0.5,
        sprite: basePath + 'Elite',
    },

    DRAGON: {
        hpScale: 4,
        speedScale: 2,
        rewardScale: 4,
        scale: 0.6,
        sprite: basePath + 'Dragon',
    },

    BOSS: {
        hpScale: 10,
        speedScale: 1,
        rewardScale: 10,
        scale: 1,
        sprite: basePath + 'Boss',
    },

    MONSTER_SPAWN_SCORE: {
        BOSS: [100, 500, 1500, 3000, 5000],
        DRAGON: [50, 250, 750, 1000, 1250, 1750, 2000, 2250, 2500, 2750, 3250, 3500, 3750, 4000, 4250, 4500, 4750]
    }
};
module.exports = MonsterConfig