const GameEnums = require('./GameEnums');
const ProjectileType = GameEnums.ProjectileType;

const WeaponStats = cc.Class({
    name: 'WeaponStats',
    properties: {
        type: {
            default: ProjectileType.BULLET,
            type: cc.Enum(ProjectileType),
        },
        fireRate: {
            default: 10,
            type: cc.Float,
        }
    }
});

module.exports = WeaponStats;