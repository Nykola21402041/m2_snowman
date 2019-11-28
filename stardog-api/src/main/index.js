const express = require('express');
const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');
const cors = require('cors');
const snowman = require('../../../snowman');
const Board = require('./domain/Board');
const Player = require('./domain/player/Player');
const SmallSnowball = require('./domain/snowball/SmallSnowball');

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
        let position = await snowmanDao.getPlayerPosition();
        console.log(position);
        const player = new Player(position[0], position[1]);
        //position = await snowmanDao.getLittleBoulePosition();
        const smallSnowball = new SmallSnowball(1, 1);
        board = new Board(snowman.game.size, player, smallSnowball);
        return board.toArray();
    },
    move: async (req) => {
        let directions = [SnowmanDAO.UP, SnowmanDAO.DOWN, SnowmanDAO.LEFT, SnowmanDAO.RIGHT];
        if (directions.indexOf(req["direction"]) === -1){
            throw "Unexpected direction";
        }
        console.log(req.direction);
        if (await snowmanDao.isCellFree(req.direction)) {
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