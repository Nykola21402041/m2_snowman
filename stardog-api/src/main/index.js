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

const SnowmanDAO = require('./SnowmanDAO');

let snowmanDao = new SnowmanDAO();
// Initialize a board game
let board = new Board(snowman.game.size);

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    getGame: [[Int]],
    move(direction:String!): [[Int]]
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
    getGame: async () => {
        const player = new Player(await snowmanDao.getPlayerPosition());
        const smallSnowball = new SmallSnowball(await snowmanDao.getLittleSnow());
        const mediumSnowball = new MediumSnowball(await snowmanDao.getMediumSnow());
        const bigSnowball = new BigSnowball(await snowmanDao.getBigSnow());
        board = new Board(snowman.game.size, player, smallSnowball, mediumSnowball, bigSnowball);
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
                let neighbor = await snowmanDao.scanNeighbor(req.direction);
                if (neighbor) {
                    let type = neighbor.get("type");
                    let position = neighbor.get("position");
                    console.log(`Snow to push : ${type} at ${position}`);
                    await snowmanDao.pushSnowOnFreeCell(position, type, req.direction);
                    await snowmanDao.movePlayer(req.direction);
                    switch (req.direction) {
                        case SnowmanDAO.UP:
                            switch (type) {
                                case SnowmanDAO.CELL_TYPE_LITTLE_SNOW:
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
                                case SnowmanDAO.CELL_TYPE_LITTLE_SNOW:
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
                                case SnowmanDAO.CELL_TYPE_LITTLE_SNOW:
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
                                case SnowmanDAO.CELL_TYPE_LITTLE_SNOW:
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