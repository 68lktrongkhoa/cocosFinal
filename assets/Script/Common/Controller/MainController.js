const GameConfig = require('GameConfig');
const StateMachine = require('javascript-state-machine');

const MainController = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null
    },

    onLoad() {
        this.init();
    },

    onDestroy() {
        cc.log('MainController destroyed');
    },

    init() {
        cc.log('\n\nMainController initialized');
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
                { name: 'backToLobby', from: 'pause', to: 'lobby' },
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
                    cc.log(`Transitioning from ${transition.from} to ${transition.to}`);
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
        cc.log('Is persist root node', cc.game.isPersistRootNode(this.node));

        this.onSceneSwitch(GameConfig.SCENE.LOBBY);
    },

    onPauseGame() {
        cc.log('Game paused');
        cc.game.pause();
    },

    onResumeGame() {
        cc.log('Game resumed');
        cc.game.resume();
    },

    onSceneSwitch(sceneName) {
        cc.log('MainController switching to scene:', sceneName);
        cc.director.loadScene(sceneName);
    },

    onExitGame() {
        cc.log('\n\nExiting game → back to Portal');
        cc.sys.localStorage.clear();

        if (MainController.instance === this) {
            cc.log('MainController instance cleared');
            MainController.instance = null;
        }

        for(let i = 0; i < this.persistRootNodeList.length; i++) {
            const node = this.persistRootNodeList[i];
            if (node && cc.game.isPersistRootNode(node)) {
                cc.game.removePersistRootNode(node);
                cc.log('Removed persist root node:', node.name);
            }
        }

        this.persistRootNodeList = null;
        cc.game.removePersistRootNode(this.node);
        cc.log('Is persist root node ', cc.game.isPersistRootNode(this.node));

        cc.director.loadScene(GameConfig.PORTAL);
    },

    addPersistRootNode(node){
        cc.game.addPersistRootNode(node);
        this.persistRootNodeList.push(node);
    }
});

module.exports = MainController;