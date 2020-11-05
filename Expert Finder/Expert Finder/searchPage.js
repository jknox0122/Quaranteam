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
	// Description: Used to perform a SQL query where the results are needed. Contentmod returns the results so it can be part of the context
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

	// Name: getCategories
	// Description: Use this function to display the various search categories
	function getCategories(res, mysql, context, complete) {
		sql = "SELECT CategoryID AS id, CategoryName AS name FROM SkillCategory";
		function setC(results) {
			context.category = results;
			console.log(results);
		}
		executeQuery(res, sql, 0, mysql, complete, setC);
	}

	// Name: getSkills
	// Description: Use this function to display the available skills
	function getSkill(id, res, mysql, context, complete) {
		sql = "SELECT SkillID AS id, SkillName AS name FROM Skills WHERE FK_CategoryID = ?";
		function setC(results) {
			if (id == 1) {
				context.skill = results;
			}
			else if (id == 2) {
				context.industry = results;
			}
			else if (id == 3) {
				context.course = results;
			}
		}
		executeQuery(res, sql, id, mysql, complete, setC);
	}

	// Name: search
	// Description: Search for expert
	function searchAny(res, index, mysql, context, complete) {
		var sql = "SELECT e.ExpertID, e.FirstName, e.LastName, s.SkillName, es.Experience FROM Experts e "
		sql += "INNER JOIN ExpertSkills es ON es.FK_ExpertID = e.ExpertID ";
		sql += "INNER JOIN Skills s ON es.FK_SkillID = s.SkillID ";
		sql += "INNER JOIN SkillCategory sk ON sk.CategoryID = s.SkillID"
		sql += "WHERE sk.CategoryID = ? AND s.SkillName = ? ";
		sql += "GROUP BY e.ExpertID ORDER BY e.LastName DESC";
		function setC(results) {
			context.experts = results;
		}
		executeQuery(res, sql, index, mysql, complete, setC);
	}

	// Display the skills currently in the database so the user can select the skill and search on it.
	router.get('/', function (req, res) {
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["search.js"];
		var mysql = req.app.get('mysql');
		getCategories(res, mysql, context, complete);
		for (var i = 1; i < 4; i++) {
			getSkill(i, res, mysql, context, complete);
		}
		function complete() {
			callbackCount++;
			if (callbackCount >= 4) {
				res.render('search', context);
			}
		}
	});

	// Return the search results
	router.get('/results/:category/:skill', function (req, res) {
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
