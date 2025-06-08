const Emitter = require('Emitter');
const EventKeys = require("EventKeys");
cc.Class({
    extends: require("PopupItem"),

    properties: {
        musicToggle: cc.Toggle,
        soundToggle: cc.Toggle,
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
});
