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
        let position = await snowmanDao.getPlayerPosition();
        const player = new Player(position[0], position[1]);
        position = await snowmanDao.getLittleSnow();
        const smallSnowball = new SmallSnowball(position[0], position[1]);
        position = await snowmanDao.getMediumSnow();
        const mediumSnowball = new MediumSnowball(position[0], position[1]);
        position = await snowmanDao.getBigSnow();
        const bigSnowball = new BigSnowball(position[0], position[1]);

        board = new Board(snowman.game.size, player, smallSnowball, mediumSnowball, bigSnowball);
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
        } else {
            if(await snowmanDao.canPush(req.direction)){
                try {
                    let type;
                    let position;
                    for (const snowType of SnowmanDAO.ALL_SNOW_CELL_TYPE) {
                        type = snowType;
                        position = await snowmanDao.tryToGetSnowInformation(req.direction, snowType);
                        if (position[0] !== -1 && position[1] !== -1) {
                            console.log(`Snow to push : ${type} at ${position[0]} ${position[1]}`);
                            await snowmanDao.pushSnowOnFreeCell(position[0], position[1], snowType, req.direction);
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
                            break;
                        }
                    }

                } catch (e) {
                    console.log(e)
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