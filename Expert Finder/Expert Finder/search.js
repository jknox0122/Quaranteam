module.exports = function () {
	var express = require('express');
	var router = express.Router();
	let sqlC = require('./sqlController.js');
	let skills = require('./skills.js');
	let rend = require('./renderer.js');

	// Display the skills currently in the database so the user can select the skill and search on it.
	router.get('/', function (req, res) {
		var mysql = req.app.get('mysql');
		let sqlObj = new sqlC.sqlController(mysql);			// Controls sql queries
		let rendObj = new rend.Renderer(res, 4, 'search')	// Controls displays
		let skillObj = new skills.Skills(-1);				// Controls skill info
		skillObj.setUpSkills(rendObj, sqlObj);
	});

	// Return the search results
	router.get('/results/:skill/:experience', function (req, res) {
		var mysql = req.app.get('mysql');
		var skill = [req.params.skill];
		var experience = [req.params.experience];
		let sqlObj = new sqlC.sqlController(mysql);
		let rendObj = new rend.Renderer(res, 5, 'results')
		let skillObj = new skills.Skills(-1);
		skillObj.setUpSkills(rendObj, sqlObj);
		skillObj.searchSkill(sqlObj, skill,experience);
		sqlObj.executeQuery('experts', rendObj, true);
	});


	return router;
}();
