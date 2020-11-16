module.exports = function () {
	var express = require('express');
	var router = express.Router();
	let sqlC = require('./sqlController.js');
	let skills = require('./skills.js');


	function profileBuilder(sql, prof, txt) {
		if (prof) {
			sql.sql1 += ", " + txt;
			sql.sql2 += ",?";
			sql.inserts.push(prof);
		}
    }

	// Name: addExpert
	// Description: Add a new expert to the database. 
	// Parameters - req - node request object, res - node response object, mysql - node mysql object, complete - a function used to call the rest of the insert queries to ensure the expert is added before we update the M:M relationship tables
	function addExpert(req, res, mysql, complete) {
		var sql1, sql2, sql, inserts;
		var sqlstuff = {
			sql1: "INSERT INTO Experts (FirstName, LastName",
			sql2: " VALUES (?,?",
			inserts: [req.body.fname, req.body.lname]
		};

		profileBuilder(sqlstuff, req.body.email, "ProfileEmail");
		profileBuilder(sqlstuff, req.body.twitter, "TwitterLink");
		profileBuilder(sqlstuff, req.body.linkedin, "LinkedInLink");
		profileBuilder(sqlstuff, req.body.git, "GithubLink");
		profileBuilder(sqlstuff, req.body.about, "About");

		sql = sqlstuff.sql1 + ")" + sqlstuff.sql2 + ")";

		// Run the query
		mysql.pool.query(sql, sqlstuff.inserts, function (error, results, fields) {
			if (error) {
				console.log("An error happened!", error);
				res.write(JSON.stringify(error));
				res.end();
			}
			console.log("No errors here!", inserts);
			complete(sqlstuff.inserts[0]);
		});
	}

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
		insertExpert(req, res, mysql, complete);
		expertData = req.body.form;
		skillData = req.body.table;
		addExpert(req, res, mysql, complete);

		function complete(expertID) {
			console.log("success");
			res.status(200);
			res.end();
		}
	});


	return router;
}();
