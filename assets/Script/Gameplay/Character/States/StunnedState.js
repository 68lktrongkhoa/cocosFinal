import IdleState from './IdleState.js';

const STUN_DURATION = 5; // Thời gian choáng 3 giây
const BLINK_INTERVAL = 0.2; // Thời gian mỗi lần chớp/tắt

export default class StunnedState {
    constructor(controller) {
        this.controller = controller;
        this.stunTimer = 0;
        this.blinkTween = null;
    }

    enter() {
        this.stunTimer = STUN_DURATION;
        this.startBlinking();
    }

    update(dt) {
        this.stunTimer -= dt;
        if (this.stunTimer <= 0) {
            this.controller.setState(new IdleState(this.controller));
        }
    }

    exit() {
        this.stopBlinking();
    }

    startBlinking() {
        this.blinkTween = cc.tween(this.controller.node)
            .repeatForever(
                cc.tween()
                    .to(BLINK_INTERVAL, { opacity: 100 })
                    .to(BLINK_INTERVAL, { opacity: 255 })
            )
            .start();
    }

    stopBlinking() {
        if (this.blinkTween) {
            this.blinkTween.stop();
            this.blinkTween = null;
        }
        this.controller.node.opacity = 255;
    }
}