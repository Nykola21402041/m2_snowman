const {Connection, query} = require('stardog');
const settings = require('../../settings');

class SnowmanDAO {

    static get LEFT() {
        return "West";
    }

    static get RIGHT() {
        return "Est";
    }

    static get UP() {
        return "North";
    }

    static get DOWN() {
        return "South";
    }

    constructor() {
        this._db = null;
        this._dbname = settings.stardog.dbname;
    }

    get db() {
        if (!this._db) {
            this._db = new Connection({
                username: settings.stardog.user,
                password: settings.stardog.password,
                endpoint: settings.stardog.endpoint
            });
        }
        return this._db;
    }

    get dbname() {
        return this._dbname;
    }

    async getPlayerPosition() {
        let response = await this.queryStardog('SELECT ?cell WHERE {?cell rdf:type :CellPlayer}');
        let position = response.body.results.bindings[0].cell.value.split("#cell")[1];
        return [position[0], position[1]];
    }

    queryStardog(queryString) {
        return query.execute(this.db, this.dbname, queryString,
            'application/sparql-results+json', {
                offset: 0,
                reasoning: true
            })
            .then((body) => {
                return body;
            }).catch((e) => {
            console.log(e);
        });
    }

    async canMove(direction) {
        const response = await this.queryStardog('ASK WHERE {?cell rdf:type :CellFree'+ direction +'Player}');
        console.log("canMove to " + direction + " " + response.body.boolean);
        return response.body.boolean;
    }

    async move(direction) {
        const response = await this.queryStardog('' +
            'DELETE { ?player :locatedAt ?cellPlayer . }' +
            'INSERT { ?player :locatedAt ?newCell . }' +
            'WHERE {' +
            '   ?player rdf:type :Player .' +
            '   ?cellPlayer rdf:type :CellPlayer .' +
            '   ?cellPlayer :has'+ direction + ' ?newCell .' +
            '}');
        return response.body;
    }

}

module.exports = SnowmanDAO;