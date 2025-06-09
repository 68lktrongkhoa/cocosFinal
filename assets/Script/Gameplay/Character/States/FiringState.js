// Gameplay/Character/States/FiringState.js
import State from '../../../Common/Patterns/State.js';
import IdleState from './IdleState.js';

export default class FiringState extends State {
    enter() {
        // Bắn viên đạn đầu tiên ngay khi vào trạng thái này
        this.controller.fire(); 
        this.fireTimer = 0;
    }

    update(dt) {
        // Logic bắn liên tục được chuyển từ CharacterController vào đây
        this.fireTimer += dt;
        if (this.fireTimer >= 1 / this.controller.fireRate) {
            this.controller.fire();
            this.fireTimer -= (1 / this.controller.fireRate);
        }
    }

    handleInput(command, isPressed) {
        // Nếu người chơi nhả phím bắn, quay về trạng thái rảnh rỗi
        if (command === "FIRE" && !isPressed) {
            this.controller.setState(new IdleState(this.controller));
        }
    }
}