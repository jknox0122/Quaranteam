module.exports = function () {
	var express = require('express');
	var router = express.Router();

	// Name: getProfile
	// Description: Get profile information
	// Parameters: res - node response object, mysql - node mysql object used to execute sql queries, context - results of query, complete - function that counts how many queries that need to execute before display the page
	function getProfile(res, mysql, context, complete) {
		var query = "SELECT * FROM profiles p";
		mysql.pool.query(query, function (error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.profiles = results;
			complete();
		});
	}


	// Display all authors
	router.get('/', function (req, res) {
		var callBack = 0;
		var context = {};
		context.jsscripts = ["delete.js", "filter.js", "search.js"];
		var mysql = req.app.get('mysql');
		getAuthors(res, mysql, context, complete);
		function complete() {
			callBack++
			if (callBack >= 1) {
				res.render('profiles', context);
			}
		}
	});

	// Display information about a specifically selected author
	router.get('/:id', function (req, res) {
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["selected.js", "update.js"];
		var mysql = req.app.get('mysql');
		context.profile = req.params.id;
		getProfiles(res, mysql, context, req.params.id, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 3) {
				res.render('view-authors', context);
			}
		}
	});

	// Add a new profile
	router.post('/', function (req, res) {
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO profiles (first_name, last_name) VALUES (?, ? )";
		var inserts = [req.body.fname, req.body.lname];
		console.log(sql);
		mysql.pool.query(sql, inserts, function (error, results, fields) {
			if (error) {
				console.log(JSON.stringify(error))
				res.write(JSON.stringify(error));
				res.end();
			} else {
				res.redirect('/profiles');
			}
		});
	});

	
	return router;
}();
