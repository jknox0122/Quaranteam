module.exports = function () {
	var express = require('express');
	var router = express.Router();
	let sqlC = require('./sqlController.js');
	let skills = require('./skills.js');

	// Display the skills currently in the database so the user can select the skill and search on it.
	router.get('/', function (req, res) {
		var mysql = req.app.get('mysql');
		let sqlObj = new sqlC.sqlController(res, mysql);
		sqlObj.setUpIteration(4, 'welcome');
		let skillObj = new skills.Skills(-1);
		skillObj.setUpSkills(sqlObj);
	});

	return router;
}();
