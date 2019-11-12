const snowman = require('../../../../../snowman');
const AbstractBoardItem = require('../AbstractBoardItem');

class Player extends AbstractBoardItem {

    static getType() {
        return snowman.game.boardItem.PLAYER.type;
    }

    get x() {
        return super.x;
    }

    get y() {
        return super.y;
    }

    set x(x) {
        console.log("Player Setter X");
        if (!Number.isInteger(x) || x >= snowman.game.size || x < 0) {
            throw `${this.constructor.getType()}  - set x : Parameter x is not a valid integer !`;
        } else {
            this._x = x;
        }
    }

    set y(y) {
        console.log("Player Setter Y");
        if (!Number.isInteger(y) || y >= snowman.game.size || y < 0) {
            throw `${this.constructor.getType()} - set y : Parameter x is not a valid integer !`;
        } else {
            this._y = y;
        }
    }
}

module.exports = Player;