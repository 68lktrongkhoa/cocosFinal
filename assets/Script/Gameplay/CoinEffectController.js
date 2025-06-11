const Emitter = require('Emitter'); 
const Events = require('EventKeys');

cc.Class({
    extends: cc.Component,

    properties: {
        coinPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    onLoad () {
        this.coinPool = new cc.NodePool();
        Emitter.registerEvent(Events.GAME.ADD_SCORE, this.playCoinEffect, this);

    },
    onDestroy() {
        Emitter.removeEventsByTarget(this);
    },

    playCoinEffect(reward, startPosition) {
        let coinNode = null;
        if (this.coinPool.size() > 0) {
            coinNode = this.coinPool.get();
        } else {
            coinNode = cc.instantiate(this.coinPrefab);
        }

        coinNode.parent = this.node; 
        coinNode.setPosition(startPosition);
        const label = coinNode.getComponent(cc.Label);
        if (label) {
            label.string = `+${reward}`;
        }

        coinNode.opacity = 255;
        coinNode.scale = 1;

        const moveUp = cc.moveBy(1.5, cc.v2(0, 100)); 
        const fadeOut = cc.fadeOut(1.5); 

        const spawnEffect = cc.spawn(moveUp, fadeOut);

        const sequence = cc.sequence(spawnEffect, cc.callFunc(() => {
            this.coinPool.put(coinNode);
        }));

        coinNode.runAction(sequence);
    },
});