module.exports = function () {
	var express = require('express');
	var router = express.Router();

	// Name: executeInsert
	// Description: General purpose function to execute mysql. This one doesn't need to return any results.
	// Parameters: res - node response object, sql - the SQL query to execute, inserts - any set parameters, mysql - node mysql object
	function executeInsert(res, sql, inserts, mysql) {
		console.log("SQL " + sql + inserts);

		mysql.pool.query(sql, inserts, function (error, results, fields) {

			if (error) {
				console.log((JSON.stringify(error)));
				res.end();
			}
		});
	}

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


	// Name: executeQuery
	// Description: General purpose function to execute a query where the results need to be returned
	// Parameters: res - node response object, sql - SQL query to execute, inserts - the parameters psased to the mysql object, complete - function to count the number of queries then display the page, contentmod - save the results of the sql call to send to handlebars file
	function executeQuery(res, sql, inserts, mysql, complete, contentmod) {
		mysql.pool.query(sql, inserts, function (error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			contentmod(results);
			complete();
		});
	}


// Name: getCategories
// Description: Use this function to display the various search categories
function getCategories(res, mysql, context, complete) {
	sql = "SELECT CategoryID AS id, CategoryName AS name FROM SkillCategory";
	function setC(results) {
		context.category = results;
		console.log(results);
	}
	executeQuery(res, sql, 0, mysql, complete, setC);
}

// Name: getSkills
// Description: Use this function to display the available skills
function getSkill(id, res, mysql, context, complete) {
	sql = "SELECT SkillID AS id, SkillName AS name FROM Skills WHERE FK_CategoryID = ?";
	function setC(results) {
		if (id == 1) {
			context.skill = results;
		}
		else if (id == 2) {
			context.industry = results;
		}
		else if (id == 3) {
			context.course = results;
		}
	}
	executeQuery(res, sql, id, mysql, complete, setC);
}

	// Get skill info to display on the page
	router.get('/', function (req, res) {
		var callbackCount = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		getCategories(res, mysql, context, complete);
		for (var i = 1; i < 4; i++) {
			getSkill(i, res, mysql, context, complete);
		}
		function complete() {
			callbackCount++;
			if (callbackCount >= 4) {
				res.render('add-expert', context);
			}
		}
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
