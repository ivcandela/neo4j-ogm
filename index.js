require('dotenv').config();

(async () => {
    const graph = require('./src/graph-service');

    const session = await graph.session();

    session
        .run('match path=(u:Profile)-[r:reacted_on]->(p:Post)<-[:published]-(t:Target) return u, r, path limit 1')
        .then(results => {
            const record = results.records[0].toObject();

            let node = record.u;
            let relationship = record.r;
            let path = record.path;
            
            graph.processRecordEntry(node)
            graph.processRecordEntry(relationship)
            graph.processRecordEntry(path)

            session.close();
        });
})();