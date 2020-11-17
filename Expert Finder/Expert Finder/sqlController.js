// This is the class object that controls what a page displays in handlebars.
// It's also the database interface, which is probably a bad idea to combine....
// Possible code smell fix?

module.exports.sqlController = class sqlController {
	constructor(res, mysql, count) {
		this.mysql = mysql;			// mysql object that connects to the db
		this.res = res;				// Display object for rending a page
		this.sql = "";				// The sql query
		this.iterations = count;	// How many times we need to run queries before a page can render
		this.inserts = [];			// The variables used in a sql query
		this.context = {}			// The handlebar parameters used to display a page
	}

	// Set the sql query and any variables that are used in the query
	setQuery(query, params) {
		this.sql = query;
		this.inserts = params;
	}

	// This sets up the number of times we'll need to run queries before we can render the page
	setUpIteration(counter, nextPage) {
		this.iterations = counter;
		this.nextPage = nextPage;
		this.callBack = 0;
    }

	// Add a parameter to the variables used in a SQL query
	addParam(param) {
		this.inserts.push(param);
	}

	// Add a handlebars parameter to display on the results page
	addContext(param, value) {
		this.context[param] = value; 
    }

	// Light weight function to insert data into a sql query then run another function on the returned data
	insertData(complete) {
		this.mysql.pool.query(this.sql, this.inserts, function (error, result, fields) {
			complete(result.insertId);
		});
	}

	// Executes SQL queries then renders a new page
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
			if (currentSQL.callBack >= currentSQL.iterations) {
				currentSQL.res.render(currentSQL.nextPage, currentSQL.context);
			}
		});
	}


};

