class AbstractBoardItem {
    constructor(x, y) {
        if (this.constructor === AbstractBoardItem) {
            throw new TypeError('Abstract class "AbstractBoardItem" cannot be instantiated directly');
        }
        this._x = Number(x);
        this._y = Number(y);
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
        console.log(this.toString());
    }

    moveDown() {
        this._x += 1;
        console.log(this.toString());
    }

    moveLeft() {
        this._y -= 1;
        console.log(this.toString());
    }

    moveRight() {
        this._y += 1;
        console.log(this.toString());
    }

    toString() {
        return `${this.constructor.getType()} - x: ${this._x}  - y: ${this._y}`;
    }

}

module.exports = AbstractBoardItem;