cc.Class({
    extends: cc.Component,

    properties: {
        bulletPrefab: {
            default: null,
            type: cc.Prefab
        },
        poolSize: 20,
    },

    onLoad() {
        this.bulletPool = new cc.NodePool();
        for (let i = 0; i < this.poolSize; ++i) {
            let bullet = cc.instantiate(this.bulletPrefab);
            this.bulletPool.put(bullet);
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

    putBullet(bullet) {
        this.bulletPool.put(bullet);
    }
});