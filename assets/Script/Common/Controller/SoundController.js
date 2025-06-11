const Emitter = require('Emitter');
const EventKeys = require("EventKeys");
const MainController = require('MainController');
const DataStorageController = require('DataStorageController');
const GameConfig = require('GameConfig');
cc.Class({
    extends: cc.Component,

    properties: {
        lobbyBGM: {
            type: cc.AudioClip,
            default: null
        },
        gameBMG:{
            type: cc.AudioClip,
            default: null
        },
        audioClick: {
            type: cc.AudioClip,
            default: null
        },
        currentBMG: {
            type: cc.AudioSource,
            default: null,
        }
    },

    onLoad () {
        MainController.instance.addPersistRootNode(this.node);
        this.currentBMG = this.lobbyBGM;
        this.loadSoundData();
        if (this.musicEnabled) {
            this.playMusic();
        }
        this.setSoundVolume(this.soundVolume);
        this.setMusicVolume(this.musicVolume);
        this.registerEvents();
    },

    onDestroy() {
        cc.audioEngine.stopMusic();
        this.removeEvents();       
    },

    registerEvents() {
        Emitter.registerEvent(EventKeys.SOUND.PLAY_ONCLICK_SOUND, this.playOnclickSound, this);
        Emitter.registerEvent(EventKeys.SOUND.STOP_MUSIC, this.stopMusic, this);
        Emitter.registerEvent(EventKeys.SOUND.PLAY_MUSIC, this.playMusic, this);
        Emitter.registerEvent(EventKeys.SOUND.SET_SOUND_VOLUME, this.setSoundVolume, this);
        Emitter.registerEvent(EventKeys.SOUND.SET_MUSIC_VOLUME, this.setMusicVolume, this);
        Emitter.registerEvent(EventKeys.SOUND.ENABLE_SOUND, this.setIsSoundEnable, this);
        Emitter.registerEvent(EventKeys.SOUND.CHANGE_CURRENT_BGM, this.changeCurrentBGM, this);
    },
    
    playMusic(){
        cc.audioEngine.playMusic(this.currentBMG, true);
        this.musicEnabled = true;
        this.saveSoundData();
    },

    setMusicVolume(volume) {
        cc.audioEngine.setMusicVolume(volume);
        this.musicVolume = volume;
        this.saveSoundData();
    },

    stopMusic(){
        cc.audioEngine.stopMusic();
        this.musicEnabled = false;
        this.saveSoundData();
    },

    playOnclickSound(){
        if(!this.getIsSoundEnable()){
            return;
        }
        cc.audioEngine.playEffect(this.audioClick, false, 1);
    },

    setSoundVolume(volume) {
        cc.audioEngine.setEffectsVolume(volume);
        this.soundVolume = volume;
        this.saveSoundData();
    },

    setIsSoundEnable(isEnable) {
        this.soundEnabled = isEnable;
        this.saveSoundData();
    },

    getIsSoundEnable() {
        return this.soundEnabled;
    },

    removeEvents() {
        Emitter.removeEventsByTarget(this);
    },

    loadSoundData() {
        const data = DataStorageController.getSoundData();
        this.musicEnabled = data.MUSIC_ENABLED;
        this.musicVolume = data.MUSIC_VOLUME;
        this.soundEnabled = data.SOUND_ENABLED;
        this.soundVolume = data.SOUND_VOLUME;
    },

    saveSoundData() {
        const data = {
            MUSIC_ENABLED: this.musicEnabled,
            MUSIC_VOLUME: this.musicVolume,
            SOUND_ENABLED: this.soundEnabled,
            SOUND_VOLUME: this.soundVolume,
        };
        DataStorageController.setSoundData(data);
    },

    changeCurrentBGM(gameScene){
        switch (gameScene) {
            case GameConfig.SCENE.LOBBY:
                this.currentBMG = this.lobbyBGM;
                break;
            case GameConfig.SCENE.GAME:
                this.currentBMG = this.gameBMG;
                break;
            default:
                console.warn('Unknown BGM type:', bmg);
                return;
        }
        this.playMusic();
    }
});