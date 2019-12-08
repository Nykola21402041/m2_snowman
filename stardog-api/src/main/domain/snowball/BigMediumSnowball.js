const snowman = require('../../../../../snowman');
const AbstractSnowball = require('./AbstractSnowball');

class BigMediumSnowball extends AbstractSnowball {

    static getType() {
        return snowman.game.boardItem.SNOWBALL_BIG_MEDIUM.type;
    }
}

module.exports = BigMediumSnowball;