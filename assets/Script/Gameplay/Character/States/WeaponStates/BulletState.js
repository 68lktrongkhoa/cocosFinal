import LaserState from './LaserState.js';

export default class BulletState {
    constructor(projectileController) {
        this.controller = projectileController;
    }

    enter() { }
    exit() {}
    update(dt) {}

    handleInput(command) {
        if (command === "TOGGLE_WEAPON") {
            this.controller.startCooldown();
            this.controller.setState(new LaserState(this.controller));
        }
    }
    
    getProjectileType() { return 'bullet'; }
}