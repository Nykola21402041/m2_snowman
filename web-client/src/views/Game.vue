<template>
    <v-container>
        <v-row>
            <v-col cols="6">
                <v-card>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <div class="centerBoard">
                                    <Board :board="board"/>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <div class="centerBoard">
                                    <v-btn v-on:click="getGame">Refresh Board</v-btn>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <div class="centerBoard">
                                    <v-btn v-on:click="newGame">New Board</v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
            <v-col cols="6">
                <v-card>
                    <v-card-title>Aide du jeu</v-card-title>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <h2>But du jeu</h2>
                                <p>
                                    Empiler les trois boules de neiges en déposant par le haut la boule de taille moyenne puis la petite.
                                </p>
                                <h2>Règles</h2>
                                <p>
                                    Une boule ne peut être empilée qu'en étant déposé par le haut.
                                    Il est impossible de déplacer des boules empilées.
                                </p>
                                <h3>Commandes</h3>
                                <p>Le jeu se joue avec les flèches directionelles du clavier.</p>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>


    </v-container>
</template>

<script>
    import AbstractPage from "./AbstractPage";
    import Board from "../components/game/board/Board";

    export default {
        name: "Game",
        extends: AbstractPage,
        data: function () {
            return {
                title: "Game",
                board: [[]],
                allowPlay: false,
            }
        },
        components: {
            Board
        },
        methods: {
            graphQLQuery: function(query, args) {
                return fetch('http://localhost:4000/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        query: query,
                        variables: args
                    })
                })
                    .then(r => r.json())
                    .then(data => { return data});
            }
            ,
            getGame: async function() {
                const res = await this.graphQLQuery('query { getGame }', {});
                this.board = res.data.getGame;
                this.allowPlay = true;
            },
            newGame: async function() {
                const res = await this.graphQLQuery('query { newGame }', {});
                this.board = res.data.newGame;
                this.allowPlay = true;
            },
            move: async function (direction) {
                this.allowPlay = false;
                const res = await this.graphQLQuery(`query Move($direction: String!) {
                move(direction: $direction)
                }`, `{"direction":"${direction}"}`);
                this.board = res.data.move;
                this.allowPlay = true;
            },
        },
        mounted() {
            this.getGame();
            window.addEventListener('keydown', (e)=> {
                const key = e.which || e.keyCode;
                if (key === 38) {
                    this.move('North');
                }
                if (key === 40) {
                    this.move('South');
                }
                if (key === 37) {
                    this.move('West');
                }
                if (key === 39) {
                    this.move('East');
                }
            });
        }
    }
</script>

<style scoped>
    .centerBoard {
        display: flex;
        justify-content: center;
    }
</style>