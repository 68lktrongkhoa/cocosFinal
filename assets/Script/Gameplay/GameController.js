const Emitter = require('Emitter');
const Events = require('EventKeys');
const GameConfig = require('GameConfig');
const DataStorageController = require('DataStorageController');

cc.Class({
    extends: cc.Component,
    properties: {
        playerNode: {
            default: null,
            type: cc.Node
        },
        buttonsNode: {
            default: null,
            type: cc.Node
        }
    },

    onLoad() {
        this.registerEvent();
        this.initCollision();
        this.initGame();
    },

    initCollision() {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    initGame() {
        this.isGameStart = false;
        const data = DataStorageController.getUpgradeStat()
        const castleLevel = data.castle;
        this.hp = GameConfig.STAT.CASTLE[castleLevel - 1].health;
        Emitter.emit(Events.GAME.INIT);
        Emitter.emit(Events.UPDATE_UI.HEALTH, this.hp);
    },

    addScore(reward) {
        this.score += reward;
        Emitter.emit(Events.UPDATE_UI.SCORE, this.score);
    },

    getScore() {
        return this.score;
    },

    registerEvent() {
        Emitter.registerEvent(Events.GAME.INIT, this.onGameInit, this);
        Emitter.registerEvent(Events.CASTLE.ON_HIT, this.onCastleHit, this);
        Emitter.registerEvent(Events.GAME.START, this.onGameStart, this);
        Emitter.registerEvent(Events.GAME.TRY_AGAIN, this.initGame, this);
        Emitter.registerEvent(Events.GAME.OPENING_DONE, this.onInitPlayerAnimation, this);
        Emitter.registerEvent(Events.GAME.ADD_SCORE, this.addScore, this);
        
    },

    onInitPlayerAnimation(){
        this.playerNode.active = true;
        this.buttonsNode.active = true;
    },

    onGameInit() {
        this.playerNode.active = false;
        this.buttonsNode.active = false;
    },

    onCastleHit(damage) {
        this.hp -= damage;
        Emitter.emit(Events.UPDATE_UI.HEALTH, this.hp);
        if (this.hp <= 0) {
            this.node.stopAllActions();
            DataStorageController.setHighScoreData(this.score, this.time);
            DataStorageController.setScoreData(this.score);
            Emitter.emit(Events.GAME.OVER, this.score, this.time);
        }
    },

    onGameStart() {
        this.elapsed = 0;
        this.time = 0;
        this.score = 0;
        this.isGameStart = true;
    },

    update(dt) {
        if (this.isGameStart) {
            this.elapsed += dt;
            if (this.elapsed >= 1) {
                this.time += Math.floor(this.elapsed);
                this.elapsed %= 1;
                Emitter.emit(Events.UPDATE_UI.TIME, this.time);
            }
        }
    },

    onDestroy() {
        Emitter.removeEventsByTarget(this);
    }
});
