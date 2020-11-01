module.exports = function () {
	var express = require('express');
	var router = express.Router();

	// Name: simpleQuery
	// Description: Used to execute simple SQL queries where the results don't matter.  Used for insert and delete calls
	function simpleQuery(sql, inserts, mysql, complete) {
		mysql.pool.query(sql, inserts, function (error, results, fields) {
			if (error) {
				console.log(error)
				res.write(JSON.stringify(error));
				res.status(400);
			}
			complete();
		});
	}

	// Name: executeQuery
	// Description: Used to performa  SQL query where the results are needed. Contentmod returns the results so it can be part of the context
	function executeQuery(res, sql, inserts, mysql, complete, contentmod) {
		mysql.pool.query(sql, inserts, function (error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			contentmod(results);
			complete();
		});
	}

	// Name: getSkills
	// Description: Use this function to display which tropes are associated with a book
	function getSkills(res, mysql, context, complete) {
		sql = "SELECT * FROM Skills ";
		function setC(results) {
			context.skills = results;
		}
		executeQuery(res, sql, 0, mysql, complete, setC);
	}

	// Name: search
	// Description: Search for expert
	function searchAny(res, index, mysql, context, complete) {
		var sql = "SELECT e.ExpertID, e.FirstName, e.LastName, s.SkillName, es.Experience FROM Experts e "
		sql += "INNER JOIN ExpertSkills es ON es.FK_ExpertID = e.ExpertID ";
		sql += "LEFT JOIN Skills s ON es.FK_SkillID = s.SkillID ";
		sql += "WHERE s.SkillName = ?  AND es.Experience > ?";
		sql += "GROUP BY e.ExpertID ORDER BY e.LastName DESC";
		function setC(results) {
			context.experts = results;
		}
		executeQuery(res, sql, index, mysql, complete, setC);
	}

	// Display the tropes currently being used
	router.get('/', function (req, res) {
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["delete.js", "filter.js", "search.js"];
		var mysql = req.app.get('mysql');
		getSkills(res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 1) {
				res.render('search', context);
			}
		}
	});

	// Allow the user to associated books with tropes
	router.get('/results', function (req, res) {
		var callbackCount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		context.jsscripts = ["delete.js", "checkbox.js"];
		searchAny(res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 1) {
				res.render('results', context);
			}
		}
	});


	return router;
}();
