<template>
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
                    <v-btn v-on:click="newGame">New Game</v-btn>
                </div>
            </v-col>
        </v-row>
        <label>
            <input v-on:keyup="moveUp"/>
        </label>
        <label>
            <input v-on:keyup.up="moveUp"/>
        </label>
        <label>
            <input v-on:keyup.down="moveDown"/>
        </label>
        <label>
            <input v-on:keyup.left="moveLeft"/>
        </label>
        <label>
            <input v-on:keyup.right="moveRight"/>
        </label>
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
            graphQLQuery: function(query) {
                return fetch('http://localhost:4000/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({query: "{" + query + "}"})
                })
                    .then(r => r.json())
                    .then(data => { return data});
            }
            ,
            newGame: async function() {
                const res = await this.graphQLQuery('newGame');
                this.board = res.data.newGame;
                this.allowPlay = true;
            },
            move: async function (move) {
                this.allowPlay = false;
                const res = await this.graphQLQuery(move);
                switch (move) {
                    case 'moveUp':
                        this.board = res.data.moveUp;
                        break;
                    case 'moveDown':
                        this.board = res.data.moveDown;
                        break;
                    case 'moveLeft':
                        this.board = res.data.moveLeft;
                        break;
                    case 'moveRight':
                        this.board = res.data.moveRight;
                        break;
                    default:
                        throw "Bad input";
                }
                this.allowPlay = true;
            },
            moveUp: async function() {
                this.move('moveUp');
            },
            moveDown: async function() {
                this.move('moveDown');
            },
            moveLeft: async function() {
                this.move('moveLeft');
            },
            moveRight: async function() {
                this.move('moveRight');
            }
        },
        mounted() {
            this.newGame();
            window.addEventListener('keydown', (e)=> {
                const key = e.which || e.keyCode;
                if (key === 38) {
                    this.moveUp();
                }
                if (key === 40) {
                    this.moveDown();
                }
                if (key === 37) {
                    this.moveLeft();
                }
                if (key === 39) {
                    this.moveRight();
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