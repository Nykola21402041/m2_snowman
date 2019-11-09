const snowman = require('../../../../../snowman');
const BoardItem = require('../AbstractBoardItem');

class AbstractSnowball extends BoardItem {

    set x(x) {
        if (!Number.isInteger(x) || x >= snowman.game.size - 1 || x < 1) {
            throw `${AbstractSnowball.getType()}  - set x : Parameter x is not a valid integer !`;
        } else {
            this._x = x;
        }
    }

    set y(y) {
        if (!Number.isInteger(y) || y >= snowman.game.size - 1|| y < 1) {
            throw `${AbstractSnowball.getType()} - set y : Parameter x is not a valid integer !`;
        } else {
            this._y = y;
        }
    }
}

module.exports = AbstractSnowball;