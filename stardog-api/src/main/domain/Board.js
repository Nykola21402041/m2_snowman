const snowman = require('../../../../snowman');
const Player = require('./player/Player');
const SmallSnowball = require('./snowball/SmallSnowball');
const MediumSnowball = require('./snowball/MediumSnowball');
const BigSnowball = require('./snowball/BigSnowball');
const {getRandomInt} = require("../helpers");

class Board {

    constructor(boardSize){
        this.boardItems = new Map();
        this.boardSize = boardSize;

        // Generate Player
        let position = this.getRandomFreeBoardPosition(this.listNotFreePosition);
        this.boardItems[snowman.game.boardItem.PLAYER] = new Player(position[0], position[1]);

        // Generate 3 differents sized snowball
        position = this.getRandomFreeBoardPosition(this.listNotFreePosition);
        this.boardItems[snowman.game.boardItem.SNOWBALL_SMALL] = new SmallSnowball(position[0], position[1]);

        position = this.getRandomFreeBoardPosition(this.listNotFreePosition);
        this.boardItems[snowman.game.boardItem.SNOWBALL_MEDIUM] = new MediumSnowball(position[0], position[1]);

        position = this.getRandomFreeBoardPosition(this.listNotFreePosition);
        this.boardItems[snowman.game.boardItem.SNOWBALL_BIG] = new BigSnowball(position[0], position[1]);

    }

    get listNotFreePosition(){
        const list = [];
        this.boardItems.forEach((boardItem => {
            list.push(boardItem.position);
        }));
        return list;
    }

    getRandomBoardPosition() {
        return [getRandomInt(this.boardSize - 2) + 1, getRandomInt(this.boardSize - 2) + 1];
    }

    isBoardPositionFree(position) {
        let positionIsFree = true;
        this.listNotFreePosition.forEach((notFreePosition) => {
            if (notFreePosition[0] === position[0] && notFreePosition[1] === position[1]) {
                positionIsFree = false;
            }
        });
        return positionIsFree;
    }

    getRandomFreeBoardPosition() {
        let position = this.getRandomBoardPosition(this.boardSize);
        while (!this.isBoardPositionFree(this.listNotFreePosition, position)) {
            position = this.getRandomBoardPosition(this.boardSize);
        }
        return position;
    };

}

module.exports = Board;