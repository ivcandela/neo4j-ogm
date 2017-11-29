const neo4j = require('neo4j-driver').default;

let driver;

const uri = process.env.NEO4J_URI;
const usr = process.env.NEO4J_USER;
const psw = process.env.NEO4J_PASSWORD;

driver = neo4j.driver(uri, neo4j.auth.basic(usr, psw));
driver.onCompleted = () => {};
driver.onError = () => {};

/**
to use if checking against original lib prototype is needed
 
const types = require('neo4j-driver/types/v1');
const typesToExport = {
    Node: types.Node,
    Relationship: types.Relationship,
    Path: types.Path,
    Segment: types.PathSegment,
}
*/

module.exports = driver;