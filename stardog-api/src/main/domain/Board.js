const snowman = require('../../../../snowman');
const Player = require('./player/Player');
const SmallSnowball = require('./snowball/SmallSnowball');
const MediumSnowball = require('./snowball/MediumSnowball');
const BigSnowball = require('./snowball/BigSnowball');
const {getRandomInt} = require("../helpers");

class Board {

    constructor(boardSize, player){
        this.boardItems = new Map();
        this.boardSize = boardSize;

        this.boardItems[snowman.game.boardItem.PLAYER.type] = player;

        // Generate 3 differents sized snowball
        //position = this.getRandomFreePosition(this.listNotFreePosition);
        //this.boardItems[snowman.game.boardItem.SNOWBALL_SMALL.type] = new SmallSnowball(position[0], position[1]);

        //position = this.getRandomFreePosition(this.listNotFreePosition);
        //this.boardItems[snowman.game.boardItem.SNOWBALL_MEDIUM.type] = new MediumSnowball(position[0], position[1]);

        //position = this.getRandomFreePosition(this.listNotFreePosition);
        //this.boardItems[snowman.game.boardItem.SNOWBALL_BIG.type] = new BigSnowball(position[0], position[1]);

    }

    get player() {
        return this.boardItems[snowman.game.boardItem.PLAYER.type];
    }

    get smallSnowball(){
        return this.boardItems[snowman.game.boardItem.SNOWBALL_SMALL.type];
    }

    get mediumSnowball(){
        return this.boardItems[snowman.game.boardItem.SNOWBALL_MEDIUM.type];
    }
    get bigSnowball(){
        return this.boardItems[snowman.game.boardItem.SNOWBALL_BIG.type];
    }

    get listNotFreePosition(){
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
        for(let i = 0; i < this.boardSize ; i++) {
            array[i] = new Array(this.boardSize).fill(snowman.game.boardItem.FREECELL.int);
        }
        array[this.player.x][this.player.y] = snowman.game.boardItem.PLAYER.int;
        //array[this.smallSnowball.x][this.smallSnowball.y] = snowman.game.boardItem.SNOWBALL_SMALL.int;
        //array[this.mediumSnowball.x][this.mediumSnowball.y] = snowman.game.boardItem.SNOWBALL_MEDIUM.int;
        //array[this.bigSnowball.x][this.bigSnowball.y] = snowman.game.boardItem.SNOWBALL_BIG.int;
        return array;
    }
}

module.exports = Board;