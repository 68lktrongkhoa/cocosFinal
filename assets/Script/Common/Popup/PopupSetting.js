const Emitter = require('Emitter');
const EventKeys = require("EventKeys");
const DataStorageController = require('DataStorageController');
const MainController = require('MainController');
cc.Class({
    extends: require("PopupItem"),

    properties: {
        musicToggle: cc.Toggle,
        musicSlider: cc.Slider,
        musicSliderProgress: { 
            type: require('SliderProgress'),
            default: null
        },
        soundToggle: cc.Toggle,
        soundSlider: cc.Slider,
        soundSliderProgress: { 
            type: require('SliderProgress'),
            default: null
        },
    },

    show(){
        this.loadSoundData();
        this.updateSliderProgress();
        this._super();
    },

    removeEvents(){
        Emitter.removeEventsByTarget(this);
    },
    
    onMusicToggleChange(toggle){
        if(toggle.isChecked){
            Emitter.emit(EventKeys.SOUND.PLAY_MUSIC);
        } else {
            Emitter.emit(EventKeys.SOUND.STOP_MUSIC);
        }
    },

    onSoundToggleChange(toggle){
        if(toggle.isChecked){
            Emitter.emit(EventKeys.SOUND.ENABLE_SOUND, true);
        } else {
            Emitter.emit(EventKeys.SOUND.ENABLE_SOUND, false);
        }
    },

    onMusicSliderChange(slider){
        const volume = slider.progress;
        if(volume <= 0) {
            this.musicToggle.isChecked = false;
        } else {
            this.musicToggle.isChecked = true;
        }
        this.musicSliderProgress.updateSize(slider);
        Emitter.emit(EventKeys.SOUND.SET_MUSIC_VOLUME, volume);
    },

    onSoundSliderChange(slider){
        const volume = slider.progress;
        if(volume <= 0) {
            this.soundToggle.isChecked = false;
        } else {
            this.soundToggle.isChecked = true;
        }
        this.soundSliderProgress.updateSize(slider);
        Emitter.emit(EventKeys.SOUND.SET_SOUND_VOLUME, volume);
    },

    onResumeClick() {
        MainController.instance.transition('resumeGame');
    },

    onBackToLobbyClick() {
        MainController.instance.transition('backToLobby');
    },

    loadSoundData() {
        const data = DataStorageController.getSoundData();
        this.musicToggle.isChecked = data.MUSIC_ENABLED;
        this.musicSlider.progress = data.MUSIC_VOLUME;
        this.soundToggle.isChecked = data.SOUND_ENABLED;
        this.soundSlider.progress = data.SOUND_VOLUME;
    },

    updateSliderProgress() {
        this.musicSliderProgress.updateSize(this.musicSlider);
        this.soundSliderProgress.updateSize(this.soundSlider);
    }
});
