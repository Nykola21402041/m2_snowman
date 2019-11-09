const snowman = require('../../../../../snowman');
const AbstractSnowball = require('./AbstractSnowball');

class MediumSnowball extends AbstractSnowball {

    static getType() {
        return snowman.game.boardItem.SNOWBALL_MEDIUM;
    }
}

module.exports = MediumSnowball;