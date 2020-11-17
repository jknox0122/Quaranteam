// A default wlcome page to get things going.
// Sets up the search bar and diusplays generic text
module.exports = function () {
	var express = require('express');
	var router = express.Router();
	let sqlC = require('./sqlController.js');
	let skills = require('./skills.js');

	// Displays the home page
	router.get('/', function (req, res) {
		var mysql = req.app.get('mysql');
		let sqlObj = new sqlC.sqlController(res, mysql);
		sqlObj.setUpIteration(4, 'welcome');	// 4 iterations - categories + 3 types of skills
		let skillObj = new skills.Skills(-1);
		skillObj.setUpSkills(sqlObj);
	});

	return router;
}();
