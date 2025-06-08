const Emitter = require('Emitter');
const EventKeys = require("EventKeys");
cc.Class({
    extends: cc.Component,

    properties: {
        audioBGM: {
            type: cc.AudioClip,
            default: null
        },

        audioClick: {
            type: cc.AudioClip,
            default: null
        },

        isPlayingSound: {
            default: true,
        },
    },

    onLoad () {
        this.playMusic();
        this.registerEvents();
    },

    onDestroy() {
        this.stopMusic();
        this.removeEvents();       
    },

    registerEvents() {
        Emitter.registerEvent(EventKeys.SOUND.PLAY_ONCLICK_SOUND, this.playOnclickSound, this);
        Emitter.registerEvent(EventKeys.SOUND.STOP_MUSIC, this.stopMusic, this);
        Emitter.registerEvent(EventKeys.SOUND.PLAY_MUSIC, this.playMusic, this);
        Emitter.registerEvent(EventKeys.SOUND.SET_SOUND_VOLUME, this.setSoundVolume, this);
        Emitter.registerEvent(EventKeys.SOUND.SET_MUSIC_VOLUME, this.setMusicVolume, this);
        Emitter.registerEvent(EventKeys.SOUND.ENABLE_SOUND, this.setIsPlayingSound, this);
    },
    
    playMusic(){
        cc.audioEngine.playMusic(this.audioBGM, true);
    },

    setMusicVolume(volume) {
        cc.audioEngine.setMusicVolume(volume);
    },

    stopMusic(){
        cc.audioEngine.stopMusic();
    },

    playOnclickSound(){
        if(!this.getIsPlayingSound()){
            return;
        }
        cc.audioEngine.playEffect(this.audioClick, false, 1);
    },

    setSoundVolume(volume) {
        cc.audioEngine.setEffectsVolume(volume);
    },

    setIsPlayingSound(isPlaying) {
        this.isPlayingSound = isPlaying;
    },

    getIsPlayingSound() {
        return this.isPlayingSound;
    },

    removeEvents() {
        Emitter.removeEvent(EventKeys.SOUND.PLAY_ONCLICK_SOUND, this.playOnclickSound);
        Emitter.removeEvent(EventKeys.SOUND.SET_MUSIC_VOLUME, this.setMusicVolume);
        Emitter.removeEvent(EventKeys.SOUND.STOP_MUSIC, this.stopMusic);
        Emitter.removeEvent(EventKeys.SOUND.SET_SOUND_VOLUME, this.setSoundVolume);
        Emitter.removeEvent(EventKeys.SOUND.SET_IS_PLAYING_SOUND, this.setIsPlayingSound);
    },

});
