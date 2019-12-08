class AbstractBoardItem {
    constructor(position) {
        if (this.constructor === AbstractBoardItem) {
            throw new TypeError('Abstract class "AbstractBoardItem" cannot be instantiated directly');
        }
        this._position = position;
        this._type = this.constructor.getType();
    }

    static getType() {
        throw new Error('Not implemented');
    }

    get type() {
        return this._type;
    }


    get position() {
        return this._position;
    }

    set position(position) {
        this._position = position;
    }

    moveUp() {
        this.position.x -= 1;
        console.log(this.toString());
    }

    moveDown() {
        this.position.x += 1;
        console.log(this.toString());
    }

    moveLeft() {
        this.position.y -= 1;
        console.log(this.toString());
    }

    moveRight() {
        this.position.y += 1;
        console.log(this.toString());
    }

    toString() {
        return `${this.constructor.getType()} ${this.position}`;
    }

}

module.exports = AbstractBoardItem;