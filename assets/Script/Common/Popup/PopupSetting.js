const Emitter = require('Emitter');
const EventKeys = require("EventKeys");
const GameConfig = require("GameConfig");
cc.Class({
    extends: require("PopupItem"),

    properties: {
        musicToggle: cc.Toggle,
        musicSlider: cc.Slider,
        soundToggle: cc.Toggle,
        soundSlider: cc.Slider,
    },

    onLoad() {
        this.loadSoundData();
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
        Emitter.emit(EventKeys.SOUND.SET_MUSIC_VOLUME, volume);
    },

    onSoundSliderChange(slider){
        const volume = slider.progress;
        if(volume <= 0) {
            this.soundToggle.isChecked = false;
        } else {
            this.soundToggle.isChecked = true;
        }
        Emitter.emit(EventKeys.SOUND.SET_SOUND_VOLUME, volume);
    },

    loadSoundData(){
        const dataString = cc.sys.localStorage.getItem(GameConfig.LOCAL_STORAGE.SOUND_DATA);
        if (dataString) {
            const data = JSON.parse(dataString);
            this.musicToggle.isChecked = data.MUSIC_ENABLED;
            this.musicSlider.progress = data.MUSIC_VOLUME;
            this.soundToggle.isChecked = data.SOUND_ENABLED;
            this.soundSlider.progress = data.SOUND_VOLUME;
        } else {
            this.musicToggle.isChecked = true;
            this.soundSlider.progress = 1;
            this.soundToggle.isChecked = true;
            this.soundSlider.progress = 1;
        }

    }
});
