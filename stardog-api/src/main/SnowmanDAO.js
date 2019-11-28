const {Connection, query} = require('stardog');
const settings = require('../../settings');

class SnowmanDAO {

    static get LEFT() {
        return "West";
    }

    static get RIGHT() {
        return "East";
    }

    static get UP() {
        return "North";
    }

    static get DOWN() {
        return "South";
    }

    static get CELL_TYPE_PLAYER(){
        return "CellPlayer";
    }

    static get CELL_TYPE_FREE(){
        return "Cell";
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
        let response = await this.queryStardog('SELECT ?x ?y WHERE {' +
            '?cell rdf:type :CellPlayer .' +
            '?cell :x ?x .' +
            '?cell :y ?y .' +
            '}');
        const x = response.body.results.bindings[0].x.value;
        const y = response.body.results.bindings[0].y.value;
        return [Number(x), Number(y)];
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

    insertCell(x, y, type) {
        const northItem = (x - 1 !== - 1) ? `cell${x - 1}${y}` : 'wall';
        const southItem = (x + 1 !== 10) ? `cell${x + 1}${y}` : 'wall';
        const westItem = (y - 1 !== - 1) ? `cell${x}${y - 1}` : 'wall';
        const eastItem = (y + 1 !== 10) ? `cell${x}${y + 1}` : 'wall';
        const query = `INSERT DATA {
            :cell${x}${y} rdf:type :${type};
                :hasNorth :${northItem};
                :hasSouth :${southItem};
                :hasWest :${westItem};
                :hasEast :${eastItem};
                :x "${x}"^^xsd:int ;
                :y "${y}"^^xsd:int . }`;
        return this.queryStardog(query);
    }

    deleteCell(x, y, type){
        const query = `DELETE WHERE {
            ?cell rdf:type :${type} ;
                :x "${x}"^^xsd:int ;
                :y "${y}"^^xsd:int . }`;
        return this.queryStardog(query);
    }

    async isCellFree(direction) {
        const response = await this.queryStardog('ASK WHERE {?cell rdf:type :CellFree' + direction + 'Player}');
        console.log("canMove to " + direction + " " + response.body.boolean);
        return response.body.boolean;
    }

    async movePlayer(direction) {
        let playerPosition = await this.getPlayerPosition();
        let x = playerPosition[0];
        let y = playerPosition[1];
        await this.deleteCell(x ,y, SnowmanDAO.CELL_TYPE_PLAYER);
        await this.insertCell(x, y, SnowmanDAO.CELL_TYPE_FREE);
        switch (direction) {
            case SnowmanDAO.UP:
                await this.deleteCell(x - 1, y, SnowmanDAO.CELL_TYPE_FREE);
                await this.insertCell(x - 1, y, SnowmanDAO.CELL_TYPE_PLAYER);
                break;
            case SnowmanDAO.DOWN:
                await this.deleteCell(x + 1, y, SnowmanDAO.CELL_TYPE_FREE);
                await this.insertCell(x + 1, y, SnowmanDAO.CELL_TYPE_PLAYER);
                break;
            case SnowmanDAO.LEFT:
                await this.deleteCell(x, y - 1, SnowmanDAO.CELL_TYPE_FREE);
                await this.insertCell(x, y - 1, SnowmanDAO.CELL_TYPE_PLAYER);
                break;
            case SnowmanDAO.RIGHT:
                await this.deleteCell(x, y + 1, SnowmanDAO.CELL_TYPE_FREE);
                await this.insertCell(x, y + 1, SnowmanDAO.CELL_TYPE_PLAYER);
                break;
            default:
                throw "Unexpected direction";
        }
    }

}

module.exports = SnowmanDAO;