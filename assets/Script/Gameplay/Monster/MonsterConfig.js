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

module.exports = MonsterConfig;