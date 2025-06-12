const DataStorageController = require('DataStorageController');
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

    initWithConfig(type = 'MOB', difficulty = 1, buffBonus = { score: 0, damage: 0 }) {
        difficulty = Math.min(difficulty, 3);
        const baseStat = MonsterConfig.BASE_STAT;
        const config = MonsterConfig[type.toString().toUpperCase()];

        this.maxHp = baseStat.hp * config.hpScale * difficulty;
        this.hp = baseStat.hp * config.hpScale * difficulty;
        this.speed = baseStat.speed * config.speedScale * difficulty;
        this.reward = Math.ceil(baseStat.reward * config.rewardScale);
        this.damage = baseStat.damage * config.damageScale;
        this.healthProgressBar.progress = 1;
        this.type = type;
        this.buffBonus = buffBonus
        this.node.opacity = 255;
        this.node.scale = config.scale;
        this._loadSprite(config.sprite);
        if (type === 'BOSS') {
            Emitter.emit(Events.GAME.BOSS_SPAWNED);
            Emitter.emit(Events.SOUND.PLAY_SFX, GameConfig.SOUND.WARNING);
        }
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
                onEnterDead: () => this._handleEnterDead(),
            }
        });
    },

    _handleSpawn() {
        this.healthProgressBar.progress = 1;
    },

    _handleMove() {
        this.rotation();
        this.moveToLeft(() => {
            Emitter.emit(Events.CASTLE.ON_HIT, this.damage);
            this.transition('hit');
            this.transition('die');
        });
    },

    _handleHit() {
        Emitter.emit(Events.SOUND.PLAY_SFX, GameConfig.SOUND.HIT);
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

        const originalPos = this.node.position;

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

    _handleEnterDead() {
        const collider = this.node.getComponent(cc.Collider);
        if (collider) {
            collider.enabled = false;
        }
    },

    transition(name) {
        if (this.can(name)) {
            this.fsm[name]();
        }
    },

    can(name) {
        return this.fsm.can(name);
    },

    moveToLeft(onComplete) {
        const targetX = -cc.winSize.width / 2;

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
        const totalAmount = amount * (1 + this.buffBonus.damage * GameConfig.GAME.BONUS.DAMAGE)
        this.hp -= totalAmount;

        if (this.hp <= 0) {
            this.transition('hit');
            this.transition('die');
            const reward = Math.floor(this.reward * (1 + this.buffBonus.score * GameConfig.GAME.BONUS.SCORE))
            Emitter.emit(Events.GAME.ADD_SCORE, reward, this.node.position);
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
        if (this.node.x > cc.winSize.width / 2 - this.node.width / 2) return;

        if (other.node.group === 'Bullet') {
            const name = other.node.name.toString();
            const data = DataStorageController.getUpgradeStat()

            let damageAmount = 0;

            if (name.includes('Bullet')) {
                const bulletLevel = data.bullet;
                damageAmount = this.getGunDamage('bullet', bulletLevel);

                const bulletScript = other.getComponent('Bullet');
                if (bulletScript) {
                    bulletScript.returnToPool();
                } else {
                    other.node.destroy();
                }
            }

            if (name.includes('Lazer')) {
                const laserLevel = data.laser;

                damageAmount = this.getGunDamage('laser', laserLevel);
            }

            this.takeDamage(damageAmount);
        }
    },
});
