<template>
    <v-app>
        <v-app-bar app
                   dense
                   dark
                   color="blue"
        >

            <v-toolbar-title>Snowman Project</v-toolbar-title>

            <v-spacer></v-spacer>

          <v-btn-toggle>
            <v-btn color="dark blue" to="/">Game</v-btn>
          </v-btn-toggle>
        </v-app-bar>

        <v-content>
          <v-row>
            <v-col offset="1" cols="10">
              <h1>{{ $store.state.pageTitle }}</h1>
            </v-col>
          </v-row>
          <v-row>
            <v-col offset="1" cols="10">
              <router-view/>
            </v-col>
          </v-row>

        </v-content>
    </v-app>
</template>

<script>

    export default {
        name: 'App',

        components: {},

        data: () => ({
            //
        }),
    };
</script>