const snowman = require('../../../../../snowman');
const AbstractSnowball = require('./AbstractSnowball');

class BigSnowball extends AbstractSnowball {

    static getType() {
        return snowman.game.boardItem.SNOWBALL_BIG.type;
    }
}

module.exports = BigSnowball;