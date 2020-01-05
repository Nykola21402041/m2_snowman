const express = require('express');
const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');
const cors = require('cors');
const snowman = require('../../../snowman');
const Board = require('./domain/Board');
const Player = require('./domain/player/Player');
const SmallSnowball = require('./domain/snowball/SmallSnowball');
const MediumSnowball = require('./domain/snowball/MediumSnowball');
const BigSnowball = require('./domain/snowball/BigSnowball');
const BigSmallSnowball = require('./domain/snowball/BigSmallSnowball');
const BigMediumSnowball  = require('./domain/snowball/BigMediumSnowball');
const BigMediumSmallSnowball = require('./domain/snowball/BigMediumSmallSnowball');
const MediumSmallSnowball = require('./domain/snowball/MediumSmallSnowball');


const SnowmanDAO = require('./SnowmanDAO');

let snowmanDao = new SnowmanDAO();
// Initialize a board game
let board = new Board(snowman.game.size);

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    getGame: [[Int]],
    newGame: [[Int]],
    move(direction:String!): [[Int]]
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
    getGame: async () => {
        let position = await snowmanDao.getBoardItem(SnowmanDAO.CELL_TYPE_PLAYER);
        const player = new Player(position);
        position = await snowmanDao.getBoardItem(SnowmanDAO.CELL_TYPE_SMALL_SNOW);
        let smallSnowball;
        if(position) {
            smallSnowball =  new SmallSnowball(position);
        }
        position = await snowmanDao.getBoardItem(SnowmanDAO.CELL_TYPE_MEDIUM_SNOW);
        let mediumSnowball;
        if(position) {
            mediumSnowball =  new MediumSnowball(position);
        }
        position = await snowmanDao.getBoardItem(SnowmanDAO.CELL_TYPE_BIG_SNOW);
        let bigSnowball;
        if(position) {
            bigSnowball =  new BigSnowball(position);
        }
        position = await snowmanDao.getBoardItem(SnowmanDAO.CELL_TYPE_MEDIUM_SMALL_SNOW);
        let mediumSmallSnowball;
        if(position) {
            mediumSmallSnowball =  new MediumSmallSnowball(position);
        }
        position = await snowmanDao.getBoardItem(SnowmanDAO.CELL_TYPE_BIG_MEDIUM_SNOW);
        let bigMediumSnowball;
        if(position) {
            bigMediumSnowball =  new BigMediumSnowball(position);
        }
        position = await snowmanDao.getBoardItem(SnowmanDAO.CELL_TYPE_BIG_SMALL_SNOW);
        let bigSmallSnowball;
        if(position) {
            bigSmallSnowball =  new BigSmallSnowball(position);
        }
        position = await snowmanDao.getBoardItem(SnowmanDAO.CELL_TYPE_BIG_MEDIUM_SMALL_SNOW);
        let bigMediumSmallSnowball;
        if(position) {
            bigMediumSmallSnowball =  new BigMediumSmallSnowball(position);
        }
        board = new Board(snowman.game.size, player, smallSnowball, mediumSnowball, bigSnowball, mediumSmallSnowball,
            bigMediumSnowball, bigSmallSnowball, bigMediumSmallSnowball);
        return board.toArray();
    },
    newGame: async () => {
        await snowmanDao.deleteAllBoardItem();
        board = new Board(snowman.game.size);
        let position = board.getRandomFreePosition(board.listNotFreePosition);
        board.add(snowman.game.boardItem.PLAYER.type, position);
        await snowmanDao.changeCellType(position.x, position.y, SnowmanDAO.CELL_TYPE_FREE, SnowmanDAO.CELL_TYPE_PLAYER);
        position = board.getRandomFreePosition(board.listNotFreePosition);
        board.add(snowman.game.boardItem.SNOWBALL_SMALL.type, position);
        await snowmanDao.changeCellType(position.x, position.y, SnowmanDAO.CELL_TYPE_FREE, SnowmanDAO.CELL_TYPE_SMALL_SNOW);
        position = board.getRandomFreePosition(board.listNotFreePosition);
        board.add(snowman.game.boardItem.SNOWBALL_MEDIUM.type, position);
        await snowmanDao.changeCellType(position.x, position.y, SnowmanDAO.CELL_TYPE_FREE, SnowmanDAO.CELL_TYPE_MEDIUM_SNOW);
        position = board.getRandomFreePosition(board.listNotFreePosition);
        board.add(snowman.game.boardItem.SNOWBALL_BIG.type, position);
        await snowmanDao.changeCellType(position.x, position.y, SnowmanDAO.CELL_TYPE_FREE, SnowmanDAO.CELL_TYPE_BIG_SNOW);
        return board.toArray();
    },
    move: async (req) => {
        if (SnowmanDAO.LIST_DIRECTION.indexOf(req["direction"]) === -1) {
            throw "Unexpected direction";
        }
        console.log(`Action move with ${req.direction} as direction`);
        if (await snowmanDao.isCellFree(req.direction)) {
            // If the cell is free then player can move in
            await snowmanDao.movePlayer(req.direction);
            switch (req.direction) {
                case SnowmanDAO.UP:
                    board.player.moveUp();
                    break;
                case SnowmanDAO.DOWN:
                    board.player.moveDown();
                    break;
                case SnowmanDAO.RIGHT:
                    board.player.moveRight();
                    break;
                case SnowmanDAO.LEFT:
                    board.player.moveLeft();
                    break;
            }
        } else {
            // Try to push the snow to move afterward
            if (await snowmanDao.canPush(req.direction)) {
                let neighbor = await snowmanDao.getTypeOfCellInDirection(req.direction, SnowmanDAO.LIST_SNOW_CELL_TYPE);
                if (neighbor) {
                    let type = neighbor.get("type");
                    let position = neighbor.get("position");
                    console.log(`Snow to push : ${type} at ${position}`);
                    await snowmanDao.pushSnowOnFreeCell(position, type, req.direction);
                    await snowmanDao.movePlayer(req.direction);
                    switch (req.direction) {
                        case SnowmanDAO.UP:
                            switch (type) {
                                case SnowmanDAO.CELL_TYPE_SMALL_SNOW:
                                    board.smallSnowball.moveUp();
                                    break;
                                case SnowmanDAO.CELL_TYPE_MEDIUM_SNOW:
                                    board.mediumSnowball.moveUp();
                                    break;
                                case SnowmanDAO.CELL_TYPE_BIG_SNOW:
                                    board.bigSnowball.moveUp();
                                    break;
                            }
                            board.player.moveUp();
                            break;
                        case SnowmanDAO.DOWN:
                            switch (type) {
                                case SnowmanDAO.CELL_TYPE_SMALL_SNOW:
                                    board.smallSnowball.moveDown();
                                    break;
                                case SnowmanDAO.CELL_TYPE_MEDIUM_SNOW:
                                    board.mediumSnowball.moveDown();
                                    break;
                                case SnowmanDAO.CELL_TYPE_BIG_SNOW:
                                    board.bigSnowball.moveDown();
                                    break;
                            }
                            board.player.moveDown();
                            break;
                        case SnowmanDAO.RIGHT:
                            switch (type) {
                                case SnowmanDAO.CELL_TYPE_SMALL_SNOW:
                                    board.smallSnowball.moveRight();
                                    break;
                                case SnowmanDAO.CELL_TYPE_MEDIUM_SNOW:
                                    board.mediumSnowball.moveRight();
                                    break;
                                case SnowmanDAO.CELL_TYPE_BIG_SNOW:
                                    board.bigSnowball.moveRight();
                                    break;
                            }
                            board.player.moveRight();
                            break;
                        case SnowmanDAO.LEFT:
                            switch (type) {
                                case SnowmanDAO.CELL_TYPE_SMALL_SNOW:
                                    board.smallSnowball.moveLeft();
                                    break;
                                case SnowmanDAO.CELL_TYPE_MEDIUM_SNOW:
                                    board.mediumSnowball.moveLeft();
                                    break;
                                case SnowmanDAO.CELL_TYPE_BIG_SNOW:
                                    board.bigSnowball.moveLeft();
                                    break;
                            }
                            board.player.moveLeft();
                            break;
                    }
                }

                // if we can't push maybe we can stack ?
            } else if (await snowmanDao.canStack(req.direction)) {
                console.log("We can stack some snow !");
                let neighbor = await snowmanDao.getTypeOfCellInDirection(req.direction, SnowmanDAO.LIST_SNOW_CELL_TYPE);
                if (neighbor) {
                    let type = neighbor.get("type");
                    let position = neighbor.get("position");
                    console.log(`Snow to stack : ${type} at ${position}`);
                    let x;
                    let y;
                    switch (req.direction) {
                        case SnowmanDAO.UP:
                            x = position.x - 1;
                            y = position.y;
                            break;
                        case SnowmanDAO.DOWN:
                            x = position.x + 1;
                            y = position.y;
                            break;
                        case SnowmanDAO.RIGHT:
                            y = position.y + 1;
                            x = position.x;
                            break;
                        case SnowmanDAO.LEFT:
                            y = position.y - 1;
                            x = position.x;
                            break;
                    }
                    let neighborOfNeighbor = await snowmanDao.getTypeOfCellAtCoords(x, y, SnowmanDAO.LIST_SNOW_CELL_TYPE);
                    let type2 = neighborOfNeighbor.get("type");
                    let position2 = neighborOfNeighbor.get("position");
                    console.log(`Snow to stack on : ${type2} at ${position2}`);
                    // On empile
                    board.clear(position);
                    board.clear(position2);
                    await snowmanDao.stackSnow(position, type, position2, type2);
                    switch (type) {
                        case SnowmanDAO.CELL_TYPE_SMALL_SNOW:
                            switch (type2) {
                                case SnowmanDAO.CELL_TYPE_MEDIUM_SNOW:
                                    board.add(snowman.game.boardItem.SNOWBALL_MEDIUM_SMALL.type,position2);
                                    break;
                                case SnowmanDAO.CELL_TYPE_BIG_SNOW:
                                    board.add(snowman.game.boardItem.SNOWBALL_BIG_SMALL.type,position2);
                                    break;
                                case SnowmanDAO.CELL_TYPE_BIG_MEDIUM_SNOW:
                                    board.add(snowman.game.boardItem.SNOWBALL_BIG_MEDIUM_SMALL.type,position2);
                                    break;
                            }
                            break;
                        case SnowmanDAO.CELL_TYPE_MEDIUM_SNOW:
                            if (type2 === SnowmanDAO.CELL_TYPE_BIG_SNOW) {
                                board.add(snowman.game.boardItem.SNOWBALL_BIG_MEDIUM.type,position2);
                            }
                            break;
                        default:
                            throw "Wrong call on stack, check StackableSnow condition";
                    }
                    await snowmanDao.movePlayer(req.direction);
                    switch (req.direction) {
                        case SnowmanDAO.UP:
                            board.player.moveUp();
                            break;
                        case SnowmanDAO.DOWN:
                            board.player.moveDown();
                            break;
                        case SnowmanDAO.RIGHT:
                            board.player.moveRight();
                            break;
                        case SnowmanDAO.LEFT:
                            board.player.moveLeft();
                            break;
                    }
                }
            }
        }
        return board.toArray();
    }

};

const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');