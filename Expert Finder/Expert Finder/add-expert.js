module.exports = function () {
	var express = require('express');
	var router = express.Router();
	let sqlC = require('./sqlController.js');


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
		console.log(sql);
		console.log(sqlstuff.inserts)

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
		console.log(skill);
		for (let s of skill) {
			sql = "INSERT INTO ExpertSkillsID (FK_ExpertID, FK_SkillID, Experience) VALUES (?, ?, ?)";
			inserts = [id, s.name, s.experience];
			executeInsert(res, sql, inserts, mysql);
		}
	}


// Name: getCategories
// Description: Use this function to display the various search categories
function getCategories(sqlControl) {
	query = "SELECT CategoryID AS id, CategoryName AS name FROM SkillCategory";
	sqlControl.setQuery(query, [0]);
	sqlControl.executeQuery('category', 2);
}

// Name: getSkills
// Description: Use this function to display the available skills
function getSkill(sqlControl, context, index) {
	query = "SELECT SkillID AS id, SkillName AS name FROM Skills WHERE FK_CategoryID = ?";
	sqlControl.setQuery(query, index);
	sqlControl.executeQuery(context, 2);
}


	// Get skill info to display on the page
	router.get('/', function (req, res) {
		var mysql = req.app.get('mysql');
		let sqlControls = new sqlC.sqlController(res, mysql);
		sqlControls.setUpIteration(4, 'add-expert');
		getCategories(sqlControls);
		getSkill(sqlControls, "skill", 1);
		getSkill(sqlControls, "industry", 2);
		getSkill(sqlControls, "course", 3);
	});

	// Add an expert and all relevant information
	router.post('/', function (req, res) {
		console.log("Posting");
		var mysql = req.app.get('mysql');
		addExpert(req, res, mysql, complete);
		function complete(id) {
			if (req.body.hasOwnProperty('skill')) {
				insertSkills(id, req, res, mysql);
			}
			res.redirect('/experts');
		}
	});


	return router;
}();
