const snowman = require('../../../../../snowman');
const AbstractSnowball = require('./AbstractSnowball');

class BigMediumSmallSnowball extends AbstractSnowball {

    static getType() {
        return snowman.game.boardItem.SNOWBALL_BIG_MEDIUM_SMALL.type;
    }
}

module.exports = BigMediumSmallSnowball;