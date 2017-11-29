const Neo4j = require('../neo4j');

class GraphSession {
    
    async init() {
        this.session = await Neo4j.session();
    }

    async run(query, params = {}) {
        return await this.session.run(query, params);
    }

    close() {
        this.session.close();
    }
}

async function create() {
    const session = new GraphSession();
    await session.init();
    return session;
}

module.exports = {create};