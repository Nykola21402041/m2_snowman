const express = require('express');
const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');
const cors = require('cors');
const snowman = require('../../../snowman');
const Board = require('./domain/Board');
const Player = require('./domain/player/Player');

const SnowmanDAO = require('./SnowmanDAO');

let snowmanDao = new SnowmanDAO();
// Initialize a board game
let board = new Board(snowman.game.size);

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    newGame: [[Int]],
    getGame: [[Int]],
    moveUp: [[Int]],
    moveDown: [[Int]],
    moveLeft: [[Int]],
    moveRight: [[Int]]
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
    newGame: () => {
        return null;
    },
    getGame: async () => {
        const position = await snowmanDao.getPlayerPosition();
        const player = new Player(position[0], position[1]);
        board = new Board(snowman.game.size, player);
        return board.toArray();
    },
    moveUp: async () => {
        if(await snowmanDao.canMove(SnowmanDAO.UP)) {
            await snowmanDao.move(SnowmanDAO.UP);
            board.player.moveUp();
        }
        return board.toArray();
    },
    moveDown: async () => {
        if(await snowmanDao.canMove(SnowmanDAO.DOWN)) {
            await snowmanDao.move(SnowmanDAO.DOWN);
            board.player.moveDown();
        }
        return board.toArray();
    },
    moveLeft: async () => {
        if(await snowmanDao.canMove(SnowmanDAO.LEFT)) {
            await snowmanDao.move(SnowmanDAO.LEFT);
            board.player.moveLeft();
        }
        return board.toArray();
    },
    moveRight: async () => {
        if(await snowmanDao.canMove(SnowmanDAO.RIGHT)) {
            await snowmanDao.move(SnowmanDAO.RIGHT);
            board.player.moveRight();
        }
        return board.toArray();
    },

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