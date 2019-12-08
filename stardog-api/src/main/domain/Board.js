const snowman = require('../../../../snowman');
const Player = require('./player/Player');
const SmallSnowball = require('./snowball/SmallSnowball');
const MediumSnowball = require('./snowball/MediumSnowball');
const BigSnowball = require('./snowball/BigSnowball');
const BigSmallSnowball = require('./snowball/BigSmallSnowball');
const BigMediumSnowball  = require('./snowball/BigMediumSnowball');
const BigMediumSmallSnowball = require('./snowball/BigMediumSmallSnowball');
const MediumSmallSnowball = require('./snowball/MediumSmallSnowball');
const {getRandomInt} = require("../helpers");

class Board {

    constructor(boardSize, player, smallSnowball, mediumSnowball, bigSnowball, mediumSmallSnowball,
                bigMediumSnowball, bigSmallSnowball, bigMediumSmallSnowball) {
        this.boardItems = new Map();
        this.boardSize = boardSize;

        this.boardItems.set(snowman.game.boardItem.PLAYER.type, player);
        if (smallSnowball) {
            this.boardItems.set(snowman.game.boardItem.SNOWBALL_SMALL.type, smallSnowball);
        }
        if (mediumSnowball) {
            this.boardItems.set(snowman.game.boardItem.SNOWBALL_MEDIUM.type, mediumSnowball);
        }
        if (bigSnowball) {
            this.boardItems.set(snowman.game.boardItem.SNOWBALL_BIG.type, bigSnowball);
        }
        if (mediumSmallSnowball) {
            this.boardItems.set(snowman.game.boardItem.SNOWBALL_MEDIUM_SMALL.type, mediumSmallSnowball);
        }
        if (bigMediumSnowball) {
            this.boardItems.set(snowman.game.boardItem.SNOWBALL_BIG_MEDIUM.type, bigMediumSnowball);
        }
        if (bigSmallSnowball) {
            this.boardItems.set(snowman.game.boardItem.SNOWBALL_BIG_SMALL.type, bigSmallSnowball);
        }
        if (bigMediumSmallSnowball) {
            this.boardItems.set(snowman.game.boardItem.SNOWBALL_BIG_MEDIUM_SMALL.type, bigMediumSmallSnowball);
        }

        // Generate 3 differents sized snowball
        //position = this.getRandomFreePosition(this.listNotFreePosition);
        //this.boardItems[snowman.game.boardItem.SNOWBALL_SMALL.type] = new SmallSnowball(position[0], position[1]);

        //position = this.getRandomFreePosition(this.listNotFreePosition);
        //this.boardItems[snowman.game.boardItem.SNOWBALL_MEDIUM.type] = new MediumSnowball(position[0], position[1]);

        //position = this.getRandomFreePosition(this.listNotFreePosition);
        //this.boardItems[snowman.game.boardItem.SNOWBALL_BIG.type] = new BigSnowball(position[0], position[1]);

    }

    clear(position) {
        let keys = [];
        this.boardItems.forEach((value, key) => {
            if(position.x === value.position.x &&
                position.y === value.position.y){
                keys.push(key)
            }
        });
        keys.forEach(key => {
            this.boardItems.delete(key);
        })
    }

    add(type, position) {
        switch (type) {
            case snowman.game.boardItem.SNOWBALL_SMALL.type:
                this.boardItems.set(type, new SmallSnowball(position));
                break;
            case snowman.game.boardItem.SNOWBALL_MEDIUM.type:
                this.boardItems.set(type, new MediumSnowball(position));
                break;
            case snowman.game.boardItem.SNOWBALL_BIG.type:
                this.boardItems.set(type, new BigSnowball(position));
                break;
            case snowman.game.boardItem.SNOWBALL_MEDIUM_SMALL.type:
                this.boardItems.set(type, new MediumSmallSnowball(position));
                break;
            case snowman.game.boardItem.SNOWBALL_BIG_MEDIUM.type:
                this.boardItems.set(type, new BigMediumSnowball(position));
                break;
            case snowman.game.boardItem.SNOWBALL_BIG_SMALL.type:
                this.boardItems.set(type, new BigSmallSnowball(position));
                break;
            case snowman.game.boardItem.SNOWBALL_BIG_MEDIUM_SMALL.type:
                this.boardItems.set(type, new BigMediumSmallSnowball(position));
                break;
        }
    }
    get player() {
        return this.boardItems.get(snowman.game.boardItem.PLAYER.type);
    }

    get smallSnowball() {
        return this.boardItems.get(snowman.game.boardItem.SNOWBALL_SMALL.type);
    }

    get mediumSnowball() {
        return this.boardItems.get(snowman.game.boardItem.SNOWBALL_MEDIUM.type);
    }

    get bigSnowball() {
        return this.boardItems.get(snowman.game.boardItem.SNOWBALL_BIG.type);
    }

    get mediumSmallSnowball() {
        return this.boardItems.get(snowman.game.boardItem.SNOWBALL_MEDIUM_SMALL.type);
    }

    get bigMediumSnowball() {
        return this.boardItems.get(snowman.game.boardItem.SNOWBALL_BIG_MEDIUM.type);
    }

    get bigSmallSnowball() {
        return this.boardItems.get(snowman.game.boardItem.SNOWBALL_BIG_SMALL.type);
    }

    get bigMediumSmallSnowball() {
        return this.boardItems.get(snowman.game.boardItem.SNOWBALL_BIG_MEDIUM_SMALL.type);
    }

    get listNotFreePosition() {
        const list = [];
        this.boardItems.forEach((boardItem => {
            list.push(boardItem.position);
        }));
        return list;
    }

    getRandomPosition() {
        return [getRandomInt(this.boardSize - 2) + 1, getRandomInt(this.boardSize - 2) + 1];
    }

    isPositionFree(position) {
        let positionIsFree = true;
        this.listNotFreePosition.forEach((notFreePosition) => {
            if (notFreePosition[0] === position[0] && notFreePosition[1] === position[1]) {
                positionIsFree = false;
            }
        });
        return positionIsFree;
    }

    getRandomFreePosition() {
        let position = this.getRandomPosition(this.boardSize);
        while (!this.isPositionFree(this.listNotFreePosition, position)) {
            position = this.getRandomPosition(this.boardSize);
        }
        return position;
    };

    toArray() {
        const array = new Array(this.boardSize);
        for (let i = 0; i < this.boardSize; i++) {
            array[i] = new Array(this.boardSize).fill(snowman.game.boardItem.FREECELL.int);
        }
        array[this.player.position.x][this.player.position.y] = snowman.game.boardItem.PLAYER.int;
        if (this.smallSnowball) {
            array[this.smallSnowball.position.x][this.smallSnowball.position.y] = snowman.game.boardItem.SNOWBALL_SMALL.int;
        }
        if (this.mediumSnowball) {
            array[this.mediumSnowball.position.x][this.mediumSnowball.position.y] = snowman.game.boardItem.SNOWBALL_MEDIUM.int;
        }
        if (this.bigSnowball) {
            array[this.bigSnowball.position.x][this.bigSnowball.position.y] = snowman.game.boardItem.SNOWBALL_BIG.int;
        }
        if (this.mediumSmallSnowball) {
            array[this.mediumSmallSnowball.position.x][this.mediumSmallSnowball.position.y] = snowman.game.boardItem.SNOWBALL_MEDIUM_SMALL.int;
        }

        if (this.bigMediumSnowball) {
            array[this.bigMediumSnowball.position.x][this.bigMediumSnowball.position.y] = snowman.game.boardItem.SNOWBALL_BIG_MEDIUM.int;
        }

        if (this.bigSmallSnowball) {
            array[this.bigSmallSnowball.position.x][this.bigSmallSnowball.position.y] = snowman.game.boardItem.SNOWBALL_BIG_SMALL.int;
        }

        if (this.bigMediumSmallSnowball) {
            array[this.bigMediumSmallSnowball.position.x][this.bigMediumSmallSnowball.position.y] = snowman.game.boardItem.SNOWBALL_BIG_MEDIUM_SMALL.int;
        }
        return array;
    }
}

module.exports = Board;