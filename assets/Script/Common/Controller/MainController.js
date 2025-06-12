const GameConfig = require('GameConfig');
const StateMachine = require('javascript-state-machine');
const Emitter = require('Emitter');
const EventKeys = require('EventKeys');

const MainController = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null
    },

    onLoad() {
        this.init();
    },

    onDestroy() {

    },

    init() {

        this._initSingleton();
        this._initFSM();
        this.persistRootNodeList = [];
    },

    _initSingleton() {
        if (!MainController.instance) {
            MainController.instance = this;
            cc.game.addPersistRootNode(this.node);
        } else {
            this.destroy();
        }
    },

    _initFSM() {
        this.fsm = new StateMachine({
            init: 'loading',
            transitions: [
                { name: 'startGame', from: 'loading', to: 'lobby' },
                { name: 'playGame', from: 'lobby', to: 'play' },
                { name: 'pauseGame', from: 'play', to: 'pause' },
                { name: 'resumeGame', from: 'pause', to: 'play' },
                { name: 'backToLobby', from: ['pause', 'play'], to: 'lobby' },
                { name: 'exitGame', from: 'lobby', to: 'end' },
            ],
            methods: {
                onStartGame: () => this.onStartGame(),
                onPlayGame: () => this.onSceneSwitch(GameConfig.SCENE.GAME),
                onPauseGame: () => this.onPauseGame(),
                onResumeGame: () => this.onResumeGame(),
                onBackToLobby: () => this.onSceneSwitch(GameConfig.SCENE.LOBBY),
                onExitGame: () => this.onExitGame(),
                onTransition: (transition) => {
                },
                onInvalidTransition: (transition, from) => {
                    cc.warn(`Invalid state attempted: ${transition} from ${from}`);
                }
            }
        });
    },

    transition(name) {
        this.fsm[name]();
    },

    can(name) {
        return this.fsm.can(name);
    },

    onStartGame() {
        this.onSceneSwitch(GameConfig.SCENE.LOBBY);
    },

    onPauseGame() {
        cc.director.pause();
    },

    onResumeGame() {
        cc.director.resume();
    },

    onSceneSwitch(sceneName) {
        Emitter.emit(EventKeys.MAIN_CONTROLLER.CLEAR);
        cc.director.loadScene(sceneName);
    },

    onExitGame() {
        if (MainController.instance === this) {
            MainController.instance = null;
        }

        for (let i = 0; i < this.persistRootNodeList.length; i++) {
            const node = this.persistRootNodeList[i];
            if (node && cc.game.isPersistRootNode(node)) {
                cc.game.removePersistRootNode(node);
            }
        }

        this.persistRootNodeList = null;
        cc.game.removePersistRootNode(this.node);

        cc.director.loadScene(GameConfig.PORTAL);

        cc.sys.localStorage.clear();   
    },

    addPersistRootNode(node) {
        cc.game.addPersistRootNode(node);
        this.persistRootNodeList.push(node);
    }
});

module.exports = MainController;