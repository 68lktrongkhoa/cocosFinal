
cc.Class({
    extends: require('PopupItem'),

    properties: {
        bullet: require('UpgradeItem'),
        laser: require('UpgradeItem'),
        castle: require('UpgradeItem'),
        skill: require('UpgradeItem'),
    },

    upgradeBullet() {
        this.bullet.upgrade();
    },

    upgradeLaser() {
        this.laser.upgrade();
    },

    upgradeCastle() {
        this.castle.upgrade();
    },

    upgradeSkill() {
        this.skill.upgrade();
    },

});
