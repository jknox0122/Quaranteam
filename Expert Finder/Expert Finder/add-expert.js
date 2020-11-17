module.exports = function () {
	var express = require('express');
	var router = express.Router();
	let sqlC = require('./sqlController.js');
	let skills = require('./skills.js');
	let exp = require('./expert.js');


	// Name: insertSkills
	// Description: Insert skills for the expert
	// Parameters: ID of added expert, req - node request object, res - node response object, mysql - node mysql object
	function insertSkills(id, req, res, mysql) {
		var skill = req.body.skill;
		if (typeof skill !== 'object') {
			skill = [skill.name];
		}
		for (let s of skill) {
			sql = "INSERT INTO ExpertSkillsID (FK_ExpertID, FK_SkillID, Experience) VALUES (?, ?, ?)";
			inserts = [id, s.name, s.experience];
			executeInsert(res, sql, inserts, mysql);
		}
	}


	// Get skill info to display on the page
	router.get('/', function (req, res) {
		var mysql = req.app.get('mysql');
		let sqlObj = new sqlC.sqlController(res, mysql);
		sqlObj.setUpIteration(4, 'add-expert');
		sqlObj.addContext("jsscripts", "[skills.js]")
		let skillObj = new skills.Skills(-1);
		skillObj.setUpSkills(sqlObj);
	});

	// Add an expert
	router.put('/', function (req, res) {
		var mysql = req.app.get('mysql');
		let sqlObj = new sqlC.sqlController(res, mysql);	// Render and database interface
		sqlObj.setUpIteration(4, 'experts');				// Number of sql queries required
		expertData = req.body.expert;						// Get teh data from the post
		skillData = req.body.skillset;

		let expObj = new exp.Expert(-1);					// Create a new user
		query = expObj.addExpert(expertData);
		sqlObj.setQuery(query, expObj.sql_construct.inserts);	

		let skillObj = new skills.Skills(1);				// Create a new set of skills for the user
		sqlObj.insertData(complete);

		function complete(expertID) {						// Once we get the ID of the user, we can add skills
			skillObj.expertID = expertID;
			if (skillData.length > 0) {
				skillObj.addSkill(sqlObj, skillData);
			}
			res.status(200);
			res.end();
       }
	});


	return router;
}();
