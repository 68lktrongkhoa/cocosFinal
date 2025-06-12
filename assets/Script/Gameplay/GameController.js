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
    },

    onLoad() {
        this.registerEvent();
        this.initCollision();
        this.initGame();
    },

    initCollision() {
        cc.director.getCollisionManager().enabled = true;
    },

    initGame() {
        this.time = 0;
        this.score = 0;
        this.isGameRun = false;
        this.buff = { score: 0, damage: 0 }
        const data = DataStorageController.getUpgradeStat()
        const castleLevel = data.castle;
        this.hp = GameConfig.STAT.CASTLE[castleLevel - 1].health;
        Emitter.emit(Events.GAME.INIT);
        Emitter.emit(Events.UPDATE_UI.HEALTH, this.hp);
        Emitter.emit(Events.SOUND.CHANGE_CURRENT_BGM, GameConfig.SCENE.GAME);
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
        Emitter.registerEvent(Events.GAME.BUFF_SELECTED, this.onBuffSelected, this);
        Emitter.registerEvent(Events.GAME.ON_GAME_OVER, this.onGameOver, this);
    },

    onInitPlayerAnimation() {
        this.playerNode.active = true;
    },

    onGameInit() {
        this.playerNode.active = false;
    },

    onCastleHit(damage) {
        this.hp -= damage;
        Emitter.emit(Events.UPDATE_UI.HEALTH, this.hp);
        if (this.hp <= 0) {
            this.onGameOver()
        } else {
            Emitter.emit(Events.UPDATE_UI.DANGER);
        }
    },

    onBuffSelected(type) {
        switch (type) {
            case GameConfig.GAME.BUFF.TYPE.SCORE: {
                this.buff.score += 1;
                Emitter.emit(Events.GAME.BUFF_SCORE_BONUS, this.buff.score);
                break;
            }
            case GameConfig.GAME.BUFF.TYPE.HEALTH: {
                this.hp += 1;
                Emitter.emit(Events.UPDATE_UI.HEALTH, this.hp);
                break;
            }
            case GameConfig.GAME.BUFF.TYPE.DAMAGE: {
                this.buff.damage += 1;
                Emitter.emit(Events.GAME.BUFF_DAMAGE_BONUS, this.buff.damage);
                break;
            }
        }
    },

    onGameStart() {
        this.elapsed = 0;
        this.isGameRun = true;
    },

    onGameOver() {
        this.isGameRun = false;
        this.playerNode.active = false;
        this.node.stopAllActions();
        DataStorageController.setHighScoreData(this.score, this.time);
        DataStorageController.setScoreData(this.score);
        Emitter.emit(Events.GAME.OVER, this.score, this.time);
    },

    update(dt) {
        if (this.isGameRun) {
            this.elapsed += dt;
            if (this.elapsed >= 1) {
                this.time += Math.floor(this.elapsed);
                this.elapsed %= 1;
                Emitter.emit(Events.UPDATE_UI.TIME, this.time);

                if (this.time % GameConfig.GAME.BUFF.SELECTION_TIME === 0) {
                    Emitter.emit(Events.UPDATE_UI.BUFF_SELECTION, this.time);
                }
            }
        }
    },

    onDestroy() {
        Emitter.removeEventsByTarget(this);
    }
});
