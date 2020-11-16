module.exports = function () {
	var express = require('express');
	var router = express.Router();
	let sqlC = require('./sqlController.js');
	let skills = require('./skills.js');

	// Name: search
	// Description: Search for expert
	function searchSkill(sqlControl, index) {
		var query = "SELECT e.ExpertID, e.FirstName, e.LastName, e.ProfileEmail, e.GithubLink, e.About FROM Experts e "
		query += "INNER JOIN ExpertSkills es ON es.FK_ExpertID = e.ExpertID ";
		query += "INNER JOIN Skills s ON es.FK_SkillID = s.SkillID ";
		query += "WHERE s.SkillID = ? ";
		query += "GROUP BY e.ExpertID ORDER BY e.LastName DESC";
		sqlControl.setQuery(query, index);
		sqlControl.executeQuery('experts', 2)
	}

	// Display the skills currently in the database so the user can select the skill and search on it.
	router.get('/', function (req, res) {
		var mysql = req.app.get('mysql');
		let sqlObj = new sqlC.sqlController(res, mysql);
		sqlObj.setUpIteration(4, 'search');
		let skillObj = new skills.Skills(-1);
		skillObj.setUpSkills(sqlObj);
	});

	// Return the search results
	router.get('/results/:skill', function (req, res) {
		var mysql = req.app.get('mysql');
		var skill = [req.params.skill];
		let sqlObj = new sqlC.sqlController(res, mysql);
		sqlObj.setUpIteration(5, 'results');
		searchSkill(sqlObj, skill);
		let skillObj = new skills.Skills(-1);
		skillObj.setUpSkills(sqlObj);
	});


	return router;
}();
