const {Connection, query} = require('stardog');
const settings = require('../../settings');
const Position = require('./domain/Position');

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

    static get LIST_DIRECTION() {
        return [
            SnowmanDAO.LEFT,
            SnowmanDAO.RIGHT,
            SnowmanDAO.UP,
            SnowmanDAO.DOWN
        ];
    }
    static get CELL_TYPE_PLAYER() {
        return "CellPlayer";
    }

    static get CELL_TYPE_FREE() {
        return "Cell";
    }

    static get LIST_SNOW_CELL_TYPE() {
        return [
            SnowmanDAO.CELL_TYPE_LITTLE_SNOW,
            SnowmanDAO.CELL_TYPE_MEDIUM_SNOW,
            SnowmanDAO.CELL_TYPE_BIG_SNOW
        ];
    }

    static get CELL_TYPE_LITTLE_SNOW() {
        return "LittleSnow";
    }

    static get CELL_TYPE_MEDIUM_SNOW() {
        return "MediumSnow";
    }

    static get CELL_TYPE_BIG_SNOW() {
        return "BigSnow";
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
        return new Position(Number(x), Number(y));
    }

    async getLittleSnow() {
        let response = await this.queryStardog('SELECT ?x ?y WHERE {' +
            '?cell rdf:type :LittleSnow .' +
            '?cell :x ?x .' +
            '?cell :y ?y .' +
            '}');
        const x = response.body.results.bindings[0].x.value;
        const y = response.body.results.bindings[0].y.value;
        return new Position(Number(x), Number(y));
    }

    async getMediumSnow() {
        let response = await this.queryStardog('SELECT ?x ?y WHERE {' +
            '?cell rdf:type :MediumSnow .' +
            '?cell :x ?x .' +
            '?cell :y ?y .' +
            '}');
        const x = response.body.results.bindings[0].x.value;
        const y = response.body.results.bindings[0].y.value;
        return new Position(Number(x), Number(y));
    }

    async getBigSnow() {
        let response = await this.queryStardog('SELECT ?x ?y WHERE {' +
            '?cell rdf:type :BigSnow .' +
            '?cell :x ?x .' +
            '?cell :y ?y .' +
            '}');
        const x = response.body.results.bindings[0].x.value;
        const y = response.body.results.bindings[0].y.value;
        return new Position(Number(x), Number(y));
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
        const northItem = (x - 1 !== -1) ? `cell${x - 1}${y}` : 'wall';
        const southItem = (x + 1 !== 10) ? `cell${x + 1}${y}` : 'wall';
        const westItem = (y - 1 !== -1) ? `cell${x}${y - 1}` : 'wall';
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

    deleteCell(x, y, type) {
        const query = `DELETE WHERE {
            ?cell rdf:type :${type} ;
                :x "${x}"^^xsd:int ;
                :y "${y}"^^xsd:int . }`;
        return this.queryStardog(query);
    }

    async isCellFree(direction) {
        const response = await this.queryStardog('ASK WHERE {?cell rdf:type :CellFree' + direction + 'Player}');
        return response.body.boolean;
    }

    async movePlayer(direction) {
        let position = await this.getPlayerPosition();
        this.swapTypeOfCellsByDirection(position, SnowmanDAO.CELL_TYPE_PLAYER, direction, SnowmanDAO.CELL_TYPE_FREE);
    }

    async changeCellType(x, y, oldType, newType) {
        await this.deleteCell(x, y, oldType);
        await this.insertCell(x, y, newType);
    }

    async swapTypeOfTwoCellsByCoords(x, y, type, x2, y2, type2) {
        await this.changeCellType(x, y, type, type2);
        await this.changeCellType(x2, y2, type2, type);
    }

    async swapTypeOfCellsByDirection(position, type, direction, directionType) {
        let x = position.x;
        let y = position.y;
        switch (direction) {
            case SnowmanDAO.UP:
                await this.swapTypeOfTwoCellsByCoords(x, y, type, x - 1, y, directionType);
                break;
            case SnowmanDAO.DOWN:
                await this.swapTypeOfTwoCellsByCoords(x, y, type, x + 1, y, directionType);
                break;
            case SnowmanDAO.LEFT:
                await this.swapTypeOfTwoCellsByCoords(x, y, type, x, y - 1, directionType);
                break;
            case SnowmanDAO.RIGHT:
                await this.swapTypeOfTwoCellsByCoords(x, y, type, x, y + 1, directionType);
                break;
            default:
                throw "Unexpected direction";
        }
    }

    async canPush(direction) {
        const response = await this.queryStardog(`ASK
        WHERE {
            ?cellPlayer rdf:type :CellPlayer .
            ?cellPlayer :has${direction} ?snow .
            ?snow rdf:type :PushableSnow .
        }`);
        return response.body.boolean;
    }

    async canStack(direction) {
        const response = await this.queryStardog(`ASK
        WHERE {
            ?cellPlayer rdf:type :CellPlayer .
            ?cellPlayer :has${direction} ?snow .
            ?snow rdf:type :StackableSnow .
        }`);
        return response.body.boolean;
    }

    async scanNeighbor(direction) {
        for(const snowType of SnowmanDAO.LIST_SNOW_CELL_TYPE){
            const response = await this.queryStardog(`
            SELECT ?x ?y
            WHERE {
                ?cellPlayer rdf:type :CellPlayer .
                ?cellPlayer :has${direction} ?snow .
                ?snow rdf:type :${snowType} .
                ?snow :x ?x .
                ?snow :y ?y .
            }`);
            if (response.body.results.bindings[0]) {
                let x = response.body.results.bindings[0].x.value;
                let y = response.body.results.bindings[0].y.value;
                let map = new Map();
                map.set("position", new Position(Number(x), Number(y)));
                map.set("type", snowType);
                return map;
            }
        }
        return null;
    }

    async pushSnowOnFreeCell(position, type, direction) {
        await this.swapTypeOfCellsByDirection(position, type, direction, SnowmanDAO.CELL_TYPE_FREE);
    }

}

module.exports = SnowmanDAO;