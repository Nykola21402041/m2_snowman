<template>
    <div class="board">
        <div v-for="(row, index) in board" :key="`row-${index}`">
            <v-row class="ma-0">
                <v-col cols="12" class="pa-0">
                    <div class="d-flex flex-row">
                        <Cell v-for="(cell, index) in row" :key="`cell-${index}`" :value="cell" />
                    </div>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script src="./lib/Board.js"/>

<style src="./lib/Board.css" scoped/>