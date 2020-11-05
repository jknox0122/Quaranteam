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
	// Description: Get profile information
	// Parameters: res - node response object, mysql - node mysql object used to execute sql queries, context - results of query, 
	// complete - function that counts how many queries that need to execute before display the page
	function getExperts(res, mysql, context, complete) {
		var query = "SELECT * FROM Experts";
		mysql.pool.query(query, function (error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.expert = results;
			complete();
		});
	}

	// Name: getExpertsbyID
	// Description: Get Experts by ID number - used to view profile information
	// Parameters: res - response object, id - the ID of the expert, mysql - node sql object, context - results being passed to handlebars, 
	// complete - function to count the number of loops through objects to we know when to render the page
	function getExpertByID(res, id, mysql, context, complete) {
		var sql = "SELECT * FROM Experts WHERE ExpertID = ?";
		function setC(results) {
			context.selected_expert = results[0];
		}
		executeQuery(res, sql, id, mysql, complete, setC);
	}

	// Name: getSkillsbyID
	// Description: Get Skills by ID number - used to view profile information
	// Parameters: res - response object, id - the ID of the expert, mysql - node sql object, context - results being passed to handlebars, 
	// complete - function to count the number of loops through objects to we know when to render the page
	function getSkillsByID(res, id, mysql, context, complete) {
		var sql = "SELECT s.SkillName, sk.CategoryName, es.Experience, e.ExpertID FROM ExpertSkills es ";
		sql += "INNER JOIN Experts e ON es.FK_ExpertID = e.ExpertID ";
		sql += "INNER JOIN Skills s ON s.SkillID = es.FK_SkillID ";
		sql += "INNER JOIN SkillCategory sk ON sk.CategoryID = s.FK_CategoryID ";
		sql += "WHERE sk.CategoryName = 'Skill' AND e.ExpertID = ? ";
		function setC(results) {
			context.skills = results;
			console.log(context.skills)
		}
		executeQuery(res, sql, id, mysql, complete, setC);
	}

	// Name: getCoursebyID
	// Description: Get Courses by ID number - used to view profile information
	// Parameters: res - response object, id - the ID of the expert, mysql - node sql object, context - results being passed to handlebars, 
	// complete - function to count the number of loops through objects to we know when to render the page
	function getCoursesByID(res, id, mysql, context, complete) {
		var sql = "SELECT s.SkillName, sk.CategoryName, es.Experience, e.ExpertID FROM ExpertSkills es ";
		sql += "INNER JOIN Experts e ON es.FK_ExpertID = e.ExpertID ";
		sql += "INNER JOIN Skills s ON s.SkillID = es.FK_SkillID ";
		sql += "INNER JOIN SkillCategory sk ON sk.CategoryID = s.FK_CategoryID ";
		sql += "WHERE sk.CategoryName = 'Course' AND e.ExpertID = ? ";
		function setC(results) {
			context.courses = results;
		}
		executeQuery(res, sql, id, mysql, complete, setC);
	}

	// Name: getIndustryByID
	// Description: Get Industry by ID number - used to view profile information
	// Parameters: res - response object, id - the ID of the expert, mysql - node sql object, context - results being passed to handlebars, 
	// complete - function to count the number of loops through objects to we know when to render the page
	function getIndustryByID(res, id, mysql, context, complete) {
		var sql = "SELECT s.SkillName, sk.CategoryName, es.Experience, e.ExpertID FROM ExpertSkills es ";
		sql += "INNER JOIN Experts e ON es.FK_ExpertID = e.ExpertID ";
		sql += "INNER JOIN Skills s ON s.SkillID = es.FK_SkillID ";
		sql += "INNER JOIN SkillCategory sk ON sk.CategoryID = s.FK_CategoryID ";
		sql += "WHERE sk.CategoryName = 'Industry' AND e.ExpertID = ? ";
		function setC(results) {
			context.industry = results;
		}
		executeQuery(res, sql, id, mysql, complete, setC);
	}


	// Display all authors
	router.get('/', function (req, res) {
		var callBack = 0;
		var context = {};
		context.jsscripts = ["delete.js", "filter.js", "search.js"];
		var mysql = req.app.get('mysql');
		getExperts(res, mysql, context, complete);
		function complete() {
			callBack++
			if (callBack >= 1) {
				res.render('experts', context);
			}
		}
	});

	// Display information about a specifically selected author
	router.get('/view/:id', function (req, res) {
		var callbackCount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		var index = [req.params.id];
		console.log(index)
		getExpertByID(res, index, mysql, context, complete);
		getSkillsByID(res, index, mysql, context, complete);
		getCoursesByID(res, index, mysql, context, complete);
		getIndustryByID(res, index, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 4) {
				res.render('profile', context);
			}
		}
	});


	return router;
}();
