const Emitter = require('Emitter');
const Events = require('EventKeys');
const GameConfig = require('GameConfig');
const MonsterConfig = require('MonsterConfig');

const MONSTER_Y_POSITIONS = [40, -130, -300];
const SPAWN_DISTANCE_X = 50;
const SPAWN_INTERVAL = 4;

cc.Class({
    extends: cc.Component,

    properties: {
        monsterPrefab: cc.Prefab,
        gameController: require('GameController'),
    },

    onLoad() {
        this.registerEvent();
        this.monsterList = [];
        this.spawnedBossScore = new Set();
        this.spawnedDragonScore = new Set();
    },

    init() {
        cc.log('MonsterController init');
        this.isGameOver = false;
        this.currentInterval = SPAWN_INTERVAL;
        this.spawnNextMonster();
    },

    spawnNextMonster() {
        if (!this.isGameOver) {
            this.spawnRandomMonster();
            cc.log('MonsterController spawnNextMonster', this.currentInterval);
            this.currentInterval = Math.max(this.currentInterval * 0.999, 1);
            this.scheduleOnce(() => {
                this.spawnNextMonster();
            }, this.currentInterval);
        }
    },

    spawnRandomMonster() {
        const monster = cc.instantiate(this.monsterPrefab);
        const position = this.getRandomSpawnPosition();

        monster.setPosition(position);
        this.node.addChild(monster);
        this.monsterList.push(monster);

        const type = this.getMonsterType();
        const config = MonsterConfig[type];
        monster.getComponent('Monster').initWithConfig(config);
    },

    getMonsterType() {
        const boss = GameConfig.MONSTER_SPAWN_SCORE.BOSS;
        const dragon = GameConfig.MONSTER_SPAWN_SCORE.DRAGON;

        for (let score of boss) {
            if (this.gameController.getScore() >= score && !this.spawnedBossScore.has(score)) {
                this.spawnedBossScore.add(score);
                return 'boss';
            }
        }

        for (let score of dragon) {
            if (this.gameController.getScore() >= score && !this.spawnedDragonScore.has(score)) {
                this.spawnedDragonScore.add(score);
                return 'dragon';
            }
        }

        return Math.random() < 0.9 ? 'mob' : 'elite';
    },

    getRandomSpawnPosition() {
        const randomY = MONSTER_Y_POSITIONS[Math.floor(Math.random() * MONSTER_Y_POSITIONS.length)] + 25;
        const startX = cc.winSize.width / 2 + SPAWN_DISTANCE_X;
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
        cc.log('onDestroy MonsterController')
        this.unschedule(this.spawnRandomMonster);
        Emitter.removeEventsByTarget(this);
        this.clearAllMonsters();
    }
});
