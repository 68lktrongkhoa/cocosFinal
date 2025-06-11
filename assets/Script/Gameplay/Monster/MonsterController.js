const Emitter = require('Emitter');
const Events = require('EventKeys');
const MonsterConfig = require('MonsterConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        monsterPrefab: cc.Prefab,
        gameController: require('GameController'),
    },

    onLoad() {
        this.registerEvent();
    },

    init() {
        this.monsterList = [];
        this.monsterCount = 0;
        this.isGameOver = false;
        this.currentInterval = MonsterConfig.SPAWN_INTERVAL;
        this.spawnedBossScore = new Set();
        this.spawnedDragonScore = new Set();
        this.spawnNextMonster();
    },

    spawnNextMonster(isStop = false) {
        if (!this.isGameOver) {
            this.spawnRandomMonster();
            this.currentInterval = Math.max(this.currentInterval * 0.99, 1);
            if (!isStop) {
                this.scheduleOnce(() => {
                    this.spawnNextMonster();
                }, this.currentInterval);
            }
        }
    },

    spawnRandomMonster() {
        const monster = cc.instantiate(this.monsterPrefab);
        const position = this.getRandomSpawnPosition();

        monster.setPosition(position);
        this.node.addChild(monster);
        this.monsterList.push(monster);

        this.difficulty = Math.pow(MonsterConfig.DIFFICULTY.scale, Math.floor(this.monsterCount / MonsterConfig.DIFFICULTY.step));
        const type = this.getMonsterType();
        monster.getComponent('Monster').initWithConfig(type, this.difficulty);
        this.monsterCount++;
    },

    getMonsterType() {
        const boss = MonsterConfig.MONSTER_SPAWN_SCORE.BOSS;
        const dragon = MonsterConfig.MONSTER_SPAWN_SCORE.DRAGON;

        for (let score of boss) {
            if (this.gameController.getScore() >= score && !this.spawnedBossScore.has(score)) {
                this.spawnedBossScore.add(score);
                return 'BOSS';
            }
        }

        for (let score of dragon) {
            if (this.gameController.getScore() >= score && !this.spawnedDragonScore.has(score)) {
                this.spawnedDragonScore.add(score);
                return 'DRAGON';
            }
        }

        const eliteRate = Math.min(0.4, 0.1 * this.difficulty);
        cc.log(eliteRate);
        return Math.random() < eliteRate ? 'ELITE' : 'MOB';
    },

    getRandomSpawnPosition() {
        const randomY = MonsterConfig.MONSTER_Y_POSITIONS[Math.floor(Math.random() * MonsterConfig.MONSTER_Y_POSITIONS.length)] + 25;
        const startX = cc.winSize.width / 2 + MonsterConfig.SPAWN_DISTANCE_X;
        return cc.v2(startX, randomY);
    },

    onMonsterDie(monster) {
        this.removeMonster(monster);
    },

    onGameOver() {
        this.unschedule(this.spawnRandomMonster);
        this.isGameOver = true
        this.clearAllMonsters();
    },

    removeMonster(monsterNode) {
        this.monsterList = this.monsterList.filter(monster => monster !== monsterNode);
        if (monsterNode && monsterNode.isValid) {
            monsterNode.stopAllActions();
            monsterNode.destroy();
        }
    },

    clearAllMonsters() {
        this.monsterList.forEach(monster => {
            if (monster && monster.isValid) monster.destroy();
        });
        this.monsterList = [];
    },

    registerEvent() {
        Emitter.registerEvent(Events.GAME.START, this.init, this);
        Emitter.registerEvent(Events.GAME.OVER, this.onGameOver, this);
        Emitter.registerEvent(Events.MONSTER.ON_DIE, this.onMonsterDie, this);
    },

    onDestroy() {
        this.unschedule(this.spawnRandomMonster);
        Emitter.removeEventsByTarget(this);
        this.clearAllMonsters();
    }
});
