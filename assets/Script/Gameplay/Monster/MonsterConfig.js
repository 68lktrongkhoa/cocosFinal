const basePath = 'Sprite/Monster/';

const MonsterConfig = {
    MONSTER_Y_POSITIONS: [40, -130, -300],
    SPAWN_DISTANCE_X: 0,
    SPAWN_INTERVAL: 2.5,

    DIFFICULTY: {
        scale: 1.1,
        step: 20
    },

    BASE_STAT: {
        hp: 20,
        speed: 15,
        reward: 10,
        damage: 1
    },

    MOB: {
        hpScale: 1,
        speedScale: 8,
        rewardScale: 1,
        damageScale: 1,
        scale: 0.4,
        sprite: basePath + 'Mob',
    },

    ELITE: {
        hpScale: 3,
        speedScale: 6,
        rewardScale: 2,
        damageScale: 2,
        scale: 0.5,
        sprite: basePath + 'Elite',
    },

    DRAGON: {
        hpScale: 6,
        speedScale: 4,
        rewardScale: 4,
        damageScale: 3,
        scale: 0.6,
        sprite: basePath + 'Dragon',
    },

    BOSS: {
        hpScale: 10,
        speedScale: 2,
        rewardScale: 10,
        damageScale: 4,
        scale: 1,
        sprite: basePath + 'Boss',
    },

    MONSTER_SPAWN_SCORE: {
        BOSS: [100, 200, 500, 800, 1000, 1500, 2000, 2500, 3000, 3500],
        DRAGON: [75, 150, 400, 900, 1400, 1900, 2400, 2900, 3400]
    }
};
module.exports = MonsterConfig