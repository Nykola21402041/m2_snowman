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

    set x(x) {
        throw new Error('Not implemented set x');
    }

    set y(y) {
        throw new Error('Not implemented set y');
    }

    get type() {
        return this._type;
    }

    get position() {
        return [this._x, this._y];
    }

    moveUp() {
        this._x -= 1;
    }

    moveDown() {
        this._x += 1;
    }

    moveLeft() {
        this._y -= 1;
    }

    moveRight() {
        this._y += 1;
    }

    toString() {
        return `${this.constructor.getType()} - x: ${this._x}  - y: ${this._y}`;
    }

}

module.exports = AbstractBoardItem;