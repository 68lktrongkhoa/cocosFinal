import BulletState from './BulletState.js';

export default class LaserState {
    constructor(projectileController) {
        this.controller = projectileController;
    }

    enter() {}
    exit() {}
    update(dt) {}

    handleInput(command) {
        if (command === "TOGGLE_WEAPON") {
            this.controller.startCooldown();
            this.controller.setState(new BulletState(this.controller));
        }
    }
    
    getProjectileType() { return 'laser'; }
}