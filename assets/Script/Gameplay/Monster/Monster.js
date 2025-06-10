const StateMachine = require('javascript-state-machine');
const Emitter = require('Emitter');
const Events = require('EventKeys');
const MonsterConfig = require('MonsterConfig');
const GameConfig = require('GameConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        healthProgressBar: cc.ProgressBar
    },

    onLoad() {
        this._initFSM();
    },

    initWithConfig(type = 'mob', difficulty = 1) {
        const baseStat = MonsterConfig.baseStat;
        const config = MonsterConfig[type];

        this.maxHp = baseStat.hp * config.hpScale * difficulty;
        this.hp = baseStat.hp * config.hpScale * difficulty;
        this.speed = baseStat.speed * config.speedScale * difficulty;
        this.reward = Math.ceil(baseStat.reward * config.rewardScale * difficulty);
        this.healthProgressBar.progress = 1;
        this.type = type;
        this.node.opacity = 255;
        this.node.scale = config.scale;
        this._loadSprite(config.sprite);
    },

    _loadSprite(spritePath) {
        const icon = this.node.getChildByName('Icon');
        const sprite = icon.getComponent(cc.Sprite);

        cc.loader.loadRes(spritePath, cc.SpriteFrame, (err, frame) => {
            if (err) {
                cc.error('Sprite load failed:', spritePath);
                return;
            }
            sprite.spriteFrame = frame;
            this.transition('spawn');
            this.transition('move');
        });
    },

    _initFSM() {
        this.fsm = new StateMachine({
            init: 'idle',
            transitions: [
                { name: 'spawn', from: 'idle', to: 'spawn' },
                { name: 'move', from: ['spawn', 'hitting'], to: 'moving' },
                { name: 'hit', from: 'moving', to: 'hitting' },
                { name: 'die', from: ['moving', 'hitting'], to: 'dead' },
            ],
            methods: {
                onSpawn: () => this._handleSpawn(),
                onMove: () => this._handleMove(),
                onHit: () => this._handleHit(),
                onDie: () => this._handleDie(),
                onTransition: (transition) => {
                },
                onInvalidTransition: (transition, from) => {
                }
            }
        });
    },

    _handleSpawn() {
        this.healthProgressBar.progress = 1;
    },

    _handleMove() {
        this.rotation();
        this.moveToLeft(() => {
            this.transition('die');
        });
    },

    _handleHit() {
        const icon = this.node.getChildByName('Icon');

        cc.tween(icon)
            .to(0.2, { color: cc.color(255, 0, 0) })
            .to(0.2, { color: cc.color(255, 255, 255) })
            .start();

    },

    _handleDie() {
        if (this.hp > 0) {
            this.hp = 0;
            this.healthProgressBar.progress = this.hp / this.maxHp;
        }

        this.node.stopAllActions();
        const icon = this.node.getChildByName('Icon');
        icon.stopAllActions();

        Emitter.emit(Events.GAME.ADD_SCORE, this.reward);


        const originalPos = this.node.position;

        cc.tween(icon)
            .to(0.5, { color: cc.color(255, 0, 0) })
            .to(0.5, { color: cc.color(255, 255, 255) })
            .start();

        cc.tween(this.node)
            .sequence(
                cc.tween().by(0.25, { x: 10 }),
                cc.tween().by(0.25, { x: -20 }),
                cc.tween().by(0.25, { x: 10 }),
                cc.tween().parallel(
                    cc.tween().to(0.5, { opacity: 0 }),
                    cc.tween().to(0.5, { scale: 0.1 })
                )
            )
            .call(() => {
                this.node.setPosition(originalPos);
                Emitter.emit(Events.MONSTER.ON_DIE, this.node);
            })
            .start();
    },

    transition(name) {
        this.fsm[name]();
    },

    can(name) {
        return this.fsm.can(name);
    },

    moveToLeft(onComplete) {
        const targetX = -cc.winSize.width / 2 - this.node.width;

        const totalDuration = (this.node.x - targetX) / this.speed;
        cc.tween(this.node)
            .to(totalDuration, { x: targetX })
            .call(onComplete)
            .start();
    },

    rotation() {
        const icon = this.node.getChildByName('Icon')
        icon.angle = 0;

        cc.tween(icon)
            .repeatForever(
                cc.tween()
                    .to(0.25, { angle: 1 }, { easing: 'sineOut' })
                    .to(0.25, { angle: -1 }, { easing: 'sineIn' })
            )
            .start();
    },

    takeDamage(amount) {
        this.hp -= amount;

        if (this.hp <= 0) {
            this.transition('die');
        } else {
            this.transition('hit');
            this.transition('move');
        }
        this.healthProgressBar.progress = this.hp / this.maxHp;
    },

    getGunDamage(type, level = 1) {
        if (type === 'bullet') {
            return GameConfig.STAT.GUN.BULLET[level - 1].damage;
        }
        if (type === 'laser') {
            return GameConfig.STAT.GUN.LASER[level - 1].damage;
        }
        return 0;
    },

    onCollisionEnter(other, self) {
        if (this.fsm.is('dead')) return;

        if (other.node.group === 'Bullet') {
            const name = other.node.name.toString();;
            let damageAmount = 0;
            if (name.includes('Bullet')) {
                damageAmount = this.getGunDamage('bullet', 1);
                const bulletScript = other.getComponent('Bullet');
                bulletScript.bulletController.putProjectile(other.node);
            }
            if (name.includes('Lazer')) {
                damageAmount = this.getGunDamage('laser', 1);
            }
            this.takeDamage(damageAmount);
        }
    },

    onDestroy() {
    }
});
