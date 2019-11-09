const express = require('express');
const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');
const cors = require('cors');
const snowman = require('../../../snowman');
const Board = require('./domain/Board');

// Initialize a board game
let board = new Board(snowman.game.size);

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    newGame: [[Int]],
    moveUp: [[Int]],
    moveDown: [[Int]],
    moveLeft: [[Int]],
    moveRight: [[Int]]
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
    newGame: () => {
        board = new Board(snowman.game.size);
        return board.toArray();
    },
    moveUp: () => {
        board.player.moveUp();
        return board.toArray();
    },
    moveDown: () => {
        board.player.moveDown();
        return board.toArray();
    },
    moveLeft: () => {
        board.player.moveLeft();
        return board.toArray();
    },
    moveRight: () => {
        board.player.moveRight();
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