const GraphSession = require('./graph-session');
const QueryBuilder = require('./query-builder');
const has = require('lodash/has');

class GraphService {

	async session() {
        return await GraphSession.create();
    }

    async exec(query, params = {}) {
        const session = await this.session();
        const result = await session.run(query, params);
        session.close();
        return result;
    }

	builder(query = '') {
		return new QueryBuilder(this, query);
    }
    
    processRecordEntry(entry) {
        if(has(entry, 'segments')) {
            console.log('Path!');
        } else if (has(entry, 'type')) {
            console.log('Relationship!');
        } else {
            console.log('Node!')
        }
    }
}



module.exports = new GraphService();