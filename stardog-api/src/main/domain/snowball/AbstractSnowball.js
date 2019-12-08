const snowman = require('../../../../../snowman');
const AbstractBoardItem = require('../AbstractBoardItem');

class AbstractSnowball extends AbstractBoardItem {

    get x() {
        return super.x;
    }

    get y() {
        return super.y;
    }

    set x(x) {
        console.log("Snowball Setter X");
        if (!Number.isInteger(x) || x >= snowman.game.size - 1 || x < 1) {
            throw `${this.constructor.getType()}  - set x : Parameter x is not a valid integer !`;
        } else {
            this.position.x = x;
        }
    }

    set y(y) {
        console.log("Snowball Setter Y");
        if (!Number.isInteger(y) || y >= snowman.game.size - 1|| y < 1) {
            throw `${this.constructor.getType()} - set y : Parameter x is not a valid integer !`;
        } else {
            this.position.y = y;
        }
    }
}

module.exports = AbstractSnowball;