module.exports = function () {
	var express = require('express');
	var router = express.Router();


	// Name: executeQuery
	// Description: General purpose function used run the queries
	// Parameters: 	res - response from the rout
	// 		sql - sql statement to execute
	// 		inserts - inserts for sql statement
	// 		mysql - the mysql object in node
	// 		complete - function that incremenets count of completed functions and displays pages
	// 		contentmod - function that sets context to results for handlebars
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

	// Name: getExperts
	// Description: Get all experts 
	// Parameters: res - response object, mysql - node sql object, context - results being passed to handlebars, complete - function to count the number of loops through objects to we know when to render the page
	function getExperts(res, mysql, context, complete) {
		var sql = "SELECT ExpertID, CONCAT(FirstName, ' ', LastName, ProfilePicture, ProfileEmail, ";
		sql += "GithubLink, LinkedinLink, TwitterLink FROM Experts"
		function setC(results) {
			context.expert = results;
		}
		executeQuery(res, sql, 0, mysql, complete, setC);
	}

	// Name: getExpertsByID
	// Description: Gets experts by ID so you can show the expert info
	// Parameters: res - response object, id - the id of the selected expert, mysql - node sql object, context - results being passed to handlebars, complete - function to count the number of loops through objects to we know when to render the page
	function getExpertsByID(res, id, mysql, context, complete) {
		var sql = "SELECT * from Experts e WHERE e.id = ?";
		function setC(results) {
			context.expert = results[0];
		}
		executeQuery(res, sql, id, mysql, complete, setC);
	}
	// Name: getSkillsByID
	// Description: Get skills associated with an expert
	// Parameters: res - response object, id - the ID of the expert in the database, mysql - node sql object, context - results being passed to handlebars, complete - function to count the number of loops through objects to we know when to render the page
	function getSkillsByID(res, id, mysql, context, complete) {
		var sql = "SELECT s.skillID, s.SkillName, es.Experience, sk.CategoryName FROM Experts e ";
		sql += "INNER JOIN ExpertSkills es ON es.FK_ExpertID = e.ExpertID ";
		sql += "INNER JOIN Skills s ON s.SkillID = es.FK_SkillID ";
		sql += "INNER JOIN SkillCategory sk ON sk.CategoryID = s.FK_CategoryID";
		sql += "WHERE e.ExpertID = ? ";
		function setC(results) {
			context.skills = results;
		}
		executeQuery(res, sql, id, mysql, complete, setC);
	}
	// Name: getOjectSize
	// Description: Get the size of an oject
	// Parameters: Object being counted
	function getObjectSize(obj) {
		var size = 0;
		for (let i of obj) {
			size++;
		}
		return size;
	}

	// Display the expert list information page
	router.get('/', function (req, res) {
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["search.js"];
		var mysql = req.app.get('mysql');
		getExperts(res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 2) {
				res.render('experts', context);
			}
		}
	});


	// Display an experts profile
	router.get('/view/:id', function (req, res) {
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["delete.js", "filter.js", "search.js"];
		var mysql = req.app.get('mysql');
		var index = [req.params.id];
		getExpertsByID(res, index, mysql, context, complete);
		getSkillsByID(res, index, mysql, context, complete);

		function complete() {
			callbackCount++;
			if (callbackCount >= 6) {
				res.render('view-expert', context);
			}
		}
	});


	//Display all experts whose criteria matches the following:
	router.get('/search/:s', function (req, res) {
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["search.js"];
		var mysql = req.app.get('mysql');
		index = [req.params.s];
		console.log(index);
		// Add search function
		console.log(context);
		function complete() {
			callbackCount++;
			if (callbackCount >= 2) {
				res.render('experts', context);
			}
		}
	});


	return router;
}();
