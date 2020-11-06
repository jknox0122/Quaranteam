module.exports.sqlController = class sqlController {
	constructor(res, mysql, count) {
		this.mysql = mysql;
		this.res = res;
		this.sql = "";
		this.iterations = count;
		this.inserts = {};
		this.context = {}
	}

	setQuery(query, params) {
		this.sql = query;
		this.inserts = params;
	}

	setUpIteration(counter, nextPage) {
		this.iterations = counter;
		this.nextPage = nextPage;
		this.callBack = 0;
    }

	addParam(param) {
		this.inserts.push(param);
	}

	// Name: executeInsert
	// Description: General purpose function to execute mysql. This one doesn't need to return any results and just inserts data into the database
	executeInsert() {
		this.mysql.pool.query(this.sql, this.inserts, function (error, results, fields) {

			if (error) {
				console.log((JSON.stringify(error)));
				this.res.end();
			}
		});
	}

	// Name: executeQuery
	// Description: General purpose function used run sql queries
	executeQuery(handlebarsResults, count) {
		var currentSQL = this;
		this.mysql.pool.query(this.sql, this.inserts, function (error, results, fields) {
			if (error) {
				this.res.write(JSON.stringify(error));
				this.res.end();
			}
			if (count == 1) {
				currentSQL.context[handlebarsResults] = results[0];
			}
			else {
				currentSQL.context[handlebarsResults] = results;
            }
			currentSQL.callBack++;
			console.log("call: " + currentSQL.callBack, " Iter: " + currentSQL.iterations);
			if (currentSQL.callBack >= currentSQL.iterations) {

				currentSQL.res.render(currentSQL.nextPage, currentSQL.context);
			}
		});
	}


};

