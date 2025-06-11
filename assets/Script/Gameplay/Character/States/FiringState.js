import IdleState from './IdleState.js';

export default class FiringState {
    constructor(controller) {
        this.controller = controller;
    }

    enter() {
        this.controller.tryToFire();
        this.controller.setState(new IdleState(this.controller));
    }
}