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

    onSoundToggleChange(toggle){
        Emitter.emit(EventKeys.SOUND.ENABLE_SOUND, toggle.isChecked);
    },

    _onSliderChange(slider, toggleComponent, progressComponent, eventKey) {
        const volume = slider.progress;
        toggleComponent.isChecked = volume > 0;
    
        progressComponent.updateSize(slider);
        Emitter.emit(eventKey, volume);
    },
    onMusicSliderChange(slider) {
        this._onSliderChange(
            slider,
            this.musicToggle,
            this.musicSliderProgress,
            EventKeys.SOUND.SET_MUSIC_VOLUME
        );
    },
    
    onSoundSliderChange(slider) {
        this._onSliderChange(
            slider,
            this.soundToggle,
            this.soundSliderProgress,
            EventKeys.SOUND.SET_SOUND_VOLUME
        );
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
