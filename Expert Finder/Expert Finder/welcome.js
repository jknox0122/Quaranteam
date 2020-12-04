// A default wlcome page to get things going.
// Sets up the search bar and diusplays generic text
module.exports = function () {
	var express = require('express');
	var router = express.Router();
	let sqlC = require('./sqlController.js');
	let skills = require('./Skills.js');
	let rend = require('./Renderer.js');

	// Displays the home page
	router.get('/', function (req, res) {
		var mysql = req.app.get('mysql');
		let sqlObj = new sqlC.sqlController(mysql);
		let rendObj = new rend.Renderer(res, 4, 'welcome');
		let skillObj = new skills.Skills(-1);
		skillObj.setUpSkills(rendObj, sqlObj);
	});

	return router;
}();
