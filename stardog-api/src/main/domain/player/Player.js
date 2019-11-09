const snowman = require('../../../../../snowman');
const BoardItem = require('../AbstractBoardItem');

class Player extends BoardItem {

    static getType() {
        return snowman.game.boardItem.PLAYER;
    }

    set x(x) {
        if (!Number.isInteger(x) || x >= snowman.game.size || x < 0) {
            throw `${Player.getType()}  - set x : Parameter x is not a valid integer !`;
        } else {
            this._x = x;
        }
    }

    set y(y) {
        if (!Number.isInteger(y) || y >= snowman.game.size || y < 0) {
            throw `${Player.getType()} - set y : Parameter x is not a valid integer !`;
        } else {
            this._y = y;
        }
    }
}

module.exports = Player;