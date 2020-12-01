module.exports = function () {
	var express = require('express');
	var router = express.Router();
	let sqlC = require('./sqlController.js');
	let skills = require('./skills.js');
	let exp = require('./expert.js');
	let rend = require('./renderer.js');

	// Get skill info to display on the page
	router.get('/', function (req, res) {
		var mysql = req.app.get('mysql');					
		let sqlObj = new sqlC.sqlController(mysql);				// Controls queries
		let rendObj = new rend.Renderer(res, 4, 'add-expert');	// Controls display
		rendObj.addContext("jsscripts", "[skills.js]")			// Add a javascript reference
		let skillObj = new skills.Skills(-1);					// Controls skills
		skillObj.setUpSkills(rendObj, sqlObj);					// Little helper function to take care of everything
	});

	// Add an expert
	router.put('/', function (req, res) {
		var mysql = req.app.get('mysql');
		let sqlObj = new sqlC.sqlController(mysql);			// Render and database interface

		expertData = req.body.expert;						// Get the data from the post
		skillData = req.body.skillset;
		console.log(skillData);
		let expObj = new exp.Expert(-1);					// Create a new user
		query = expObj.addExpert(expertData);
		sqlObj.setQuery(query, expObj.sql_construct.inserts);	

		let skillObj = new skills.Skills(1);				// Create a new set of skills for the user
		sqlObj.insertData(complete);

		function complete(expertID) {						// Once we get the ID of the user, we can add skills
			console.log(expertID)
			skillObj.expertID = expertID;
			if (typeof skillData != 'undefined') {
				skillObj.addSkill(sqlObj, skillData);
			}
			res.status(200);
			res.end();
	   }
	});


	return router;
}();
