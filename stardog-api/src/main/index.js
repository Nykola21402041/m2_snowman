const express = require('express');
const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');
const cors = require('cors');
const snowman = require('../../../snowman');
const Board = require('./domain/Board');
// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    newGame: [[Int]],
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
    newGame: () => {
        const board = new Board(snowman.game.size);
        console.log(board);

        /*
         TODO Initaliser les positions dans stardog
         TODO Faire une requête stardog pour récupérer les positions des boules de neiges
         TODO Faire une requête stardog pour récupérer la position du joueur
         TODO Faire une requête stardog pour récupérer les mouvements possibles
         TODO Créer un objet qui transforme les résultats des requêtes en format exploitable
         TODO Générer une réponnse qui comprennds l'exploitation du TODO ci-dessus
         */

        return [
            [0, 0, 0, 0, 0, 4, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 3, 0, 0, 2, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
            ;
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