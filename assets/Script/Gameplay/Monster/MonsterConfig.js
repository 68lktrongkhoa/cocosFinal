const basePath = 'Sprite/Monster/';
const MonsterConfig = {
    mob: {
        hp: 50,
        speed: 40,
        scale: 0.4,
        sprite: basePath + 'Mob',
        reward: 5
    },
    elite: {
        hp: 100,
        speed: 20,
        scale: 0.5,
        sprite: basePath + 'Elite',
        reward: 10
    },
    dragon: {
        hp: 200,
        speed: 10,
        scale: 0.6,
        sprite: basePath + 'Dragon',
        reward: 20
    },
    boss: {
        hp: 500,
        speed: 5,
        scale: 1,
        sprite: basePath + 'Boss',
        reward: 50
    }
};

const MONSTER_SPAWN_SCORE = {
    BOSS: [100, 500, 1500, 3000, 5000],
    DRAGON: [50, 250, 750, 1000, 1250, 1750, 2000, 2250, 2500, 2750, 3250, 3500, 3750, 4000, 4250, 4500, 4750]
}

module.exports = {
    MonsterConfig,
    MONSTER_SPAWN_SCORE
};