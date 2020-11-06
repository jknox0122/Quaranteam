module.exports = function () {
	var express = require('express');
	var router = express.Router();
	let sqlC = require('./sqlController.js');

	// Name: getCategories
	// Description: Use this function to display the various search categories
	function getCategories(sqlControl) {
		query = "SELECT CategoryID AS id, CategoryName AS name FROM SkillCategory";
		sqlControl.setQuery(query, [0]);
		sqlControl.executeQuery('category', 2)
	}

	// Name: getSkills
	// Description: Use this function to display the available skills
	function getSkill(sqlControl, context, index) {
		query = "SELECT SkillID AS id, SkillName AS name FROM Skills WHERE FK_CategoryID = ?";
		sqlControl.setQuery(query, index);
		sqlControl.executeQuery(context, 2)
	}

	// Name: search
	// Description: Search for expert
	function searchSkill(sqlControl, index) {
		var query = "SELECT e.ExpertID, e.FirstName, e.LastName, e.ProfileEmail, e.GithubLink, e.About FROM Experts e "
		query += "INNER JOIN ExpertSkills es ON es.FK_ExpertID = e.ExpertID ";
		query += "INNER JOIN Skills s ON es.FK_SkillID = s.SkillID ";
		query += "WHERE s.SkillID = ? ";
		query += "GROUP BY e.ExpertID ORDER BY e.LastName DESC";
		sqlObj.setQuery(query, index);
		sqlControl.executeQuery('experts', 2)
	}

	// Display the skills currently in the database so the user can select the skill and search on it.
	router.get('/', function (req, res) {
		var mysql = req.app.get('mysql');
		let sqlControls = new sqlC.sqlController(res, mysql);
		sqlControls.setUpIteration(4, 'search');
		getCategories(sqlControls);
		getSkill(sqlControls, 'skill', 1);
		getSkill(sqlControls, 'industry', 2)
		getSkill(sqlControls, 'course', 3)
	});

	// Return the search results
	router.get('/results/:skill', function (req, res) {
		var mysql = req.app.get('mysql');
		var skill = [req.params.skill];
		let sqlControls = new sqlC.sqlController(res, mysql);
		sqlControls.setUpIteration(1, 'results');
		searchSkill(sqlCopntrosl, skill);
	});


	return router;
}();
