const snowman = require('../../../../../snowman');
const AbstractSnowball = require('./AbstractSnowball');

class SmallSnowball extends AbstractSnowball {

    static getType() {
        return snowman.game.boardItem.SNOWBALL_SMALL.type;
    }
}

module.exports = SmallSnowball;