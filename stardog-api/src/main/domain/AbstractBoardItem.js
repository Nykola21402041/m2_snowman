const snowman = require('../../../../snowman');

class AbstractBoardItem {
    constructor(x, y) {
        if (this.constructor === AbstractBoardItem) {
            throw new TypeError('Abstract class "AbstractBoardItem" cannot be instantiated directly');
        }
        this._x = x;
        this._y = y;
        this._type = this.constructor.getType();
    }

    static getType() {
        throw new Error('Not implemented');
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get type() {
        return this._type;
    }

    get position(){
        return [this.x, this.y];
    }

    set x(x) {
        throw new Error('Not implemented set x');
    }

    set y(y) {
        throw new Error('Not implemented set y');
    }

    toString() {
        return `${AbstractBoardItem.getType()} x: ${this.x} y: ${this.y}`
    }

}
module.exports = AbstractBoardItem;