// This is the class object that controls what a page displays in handlebars.
// It's also the database interface

module.exports.sqlController = class sqlController {
	constructor(mysql) {
		this.mysql = mysql;			// mysql object that connects to the db
		this.inserts = [];			// The variables used in a sql query
		this.query = "";
	}

	// Set the sql query and any variables that are used in the query
	setQuery(query, params) {
		this.sql = query;
		this.inserts = params;
	}

	// Light weight function to insert data into a sql query then run another function on the returned data
	insertData(complete) {
		this.mysql.pool.query(this.sql, this.inserts, function (error, result, fields) {
			complete(result.insertId);
		});
	}

	// Executes SQL queries then renders a new page
	executeQuery(handlebarsResults, rendObj, multiple) {
		this.mysql.pool.query(this.sql, this.inserts, function (error, results, fields) {
			if (multiple) {
				rendObj.addContext(handlebarsResults, results);
			}
			else {
				rendObj.addContext(handlebarsResults, results[0]);
			}
			rendObj.displayPage(error);
		});
	}


};

