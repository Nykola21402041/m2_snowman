const snowman = require('../../../../../snowman');
const AbstractSnowball = require('./AbstractSnowball');

class BigSmallSnowball extends AbstractSnowball {

    static getType() {
        return snowman.game.boardItem.SNOWBALL_BIG_SMALL.type;
    }
}

module.exports = BigSmallSnowball;