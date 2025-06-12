const Emitter = require('../../Common/Event/Emitter'); 
const EventKey = require('../../Common/Event/EventKeys');
cc.Class({
    extends: cc.Component,

    properties: {
        bulletPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    onLoad() {
        this.bulletPool = new cc.NodePool();
        
    },
    onEnable() {
        Emitter.registerEvent(EventKey.GAMEPLAY.FIRE_BULLET, this.onCharacterFire, this);
    },

    onDisable() {
        Emitter.removeEventsByTarget(this);
    },
    
    onDestroy() {
        if (this.characterNode) {
            this.characterNode.off('fire-bullet', this.onCharacterFire, this);
        }
    },

    getBullet(firePointPosition, direction) {
        let bullet = null;
        if (this.bulletPool.size() > 0) {
            bullet = this.bulletPool.get();
        } else {
            bullet = cc.instantiate(this.bulletPrefab);
            console.warn("Bullet pool is empty, creating new bullet.");
        }

        if (bullet) {
            bullet.parent = this.node.parent;
            bullet.position = firePointPosition;

            let bulletScript = bullet.getComponent('Bullet');
            if (bulletScript) {
                bulletScript.init(this, direction);
            }
        }
        return bullet;
    },
    onCharacterFire(eventData) {
        const worldPos = eventData.position;
        const direction = eventData.direction;

        const firePointNodePos = this.node.parent.convertToNodeSpaceAR(worldPos);
        this.getBullet(firePointNodePos, direction);
    },


    putBullet(bullet) {
        this.bulletPool.put(bullet);
    }
});