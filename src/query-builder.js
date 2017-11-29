const keys = require('lodash/keys');
const forIn = require('lodash/forIn');
const pick = require('lodash/pick');

module.exports = class QueryBuilder {
	constructor(graphService, query = '') {
        this.graphService = graphService;
		this.query = query;
	}

    async exec(params = {}) {
        return await this.graphService.exec(this.query, params);
    } 

	/**
	 *
	 * @param nodes must be object of structure {alias: NodeInstance}
	 */
	create(nodes = {}) {
		this.query += `CREATE `;
		forIn(nodes, (node, alias) => this.node(alias, node));
		return this;
	}

	onCreateSet(nodeAlias, props, labels = []) {
		this.query += `ON CREATE SET `;
		const propsArray = [
			...(keys(props)
			.map(prop => `${nodeAlias}.${prop}={${prop}}`)),
			...(labels.map(label => `${nodeAlias} :${label}`))
		];


		this.query += propsArray.join(', ') + ' ';
		return this;
	}

	onMergeSet(nodeAlias, props, labels = []) {
		this.query += `ON MATCH SET `;
		const propsArray = [
			...(keys(props)
				.map(prop => `${nodeAlias}.${prop}={${prop}}`)),
			...(labels.map(label => `${nodeAlias} :${label}`))
		];
		this.query += propsArray.join(', ') + ' ';
		return this;
	}

	/**
	 *
	 * @param node must be Node instance
	 * @param alias must be string
	 * @param props
	 */
	node(alias, node, props = []) {
		if(node) {
			const propertiesToUse = props.length > 0 ? pick(node.props, props) : node.props;
			this.query += `(${alias}:${node._entity} ${this._props(propertiesToUse)}) `;
		} else {
			this.query += `(${alias}) `;
		}
		return this;
	}

	/**
	 *
	 * @param relation must be Relation instance
	 * @param alias must be string
	 * @param props
	 */
	relation(alias, relation, props=[]) {
		if(relation) {
			const propertiesToUse = props.length > 0 ? pick(relation.props, props) : relation.props;
			this.query += `-[${alias}:${relation._type} ${this._props(relation.props)}]->`;
		}else{
			this.query += `(${alias}) `;
		}
		return this;
	}

	/**
	 *
	 * @param clause must be string
	 */
	with(clause = '') {
		this.query += `WITH ${clause} `;
		return this;
	}

	/**
	 *
	 * @param clause must be string
	 */
	merge(clause = '') {
		this.query += `MERGE ${clause} `;
		return this;
	}

	/**
	 *
	 * @param clause must be string
	 */
	match(clause = '') {
		this.query += `MATCH ${clause} `;
		return this;
	}

	/**
	 *
	 * @param clause must be string
	 */
	ret(clause = '') {
		this.query += `RETURN ${clause} `;

		return this;
	}

	_(stuff = '') {
		this.query += stuff;
		return this;
	}

	get () {
		return this.query;
	}

	// Somewhat internals

	_props(props) {
		const propKeys = keys(props);
		if(!propKeys.length) {
			return '';
		}
		const propsArray = propKeys.map(prop => `${prop}: {${prop}}`);
		return '{' + propsArray.join(', ') + '}';
	}

}
