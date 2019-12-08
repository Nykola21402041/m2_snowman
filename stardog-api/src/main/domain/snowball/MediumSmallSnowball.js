const snowman = require('../../../../../snowman');
const AbstractSnowball = require('./AbstractSnowball');

class MediumSmallSnowball extends AbstractSnowball {

    static getType() {
        return snowman.game.boardItem.SNOWBALL_MEDIUM_SMALL.type;
    }
}

module.exports = MediumSmallSnowball;