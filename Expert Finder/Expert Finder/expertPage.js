const { request } = require('express');

	function getSingleSkillByID(sqlObj, rendObj, index) {
		var query = "SELECT s.SkillName as name,  es.Experience, e.ExpertID, es.ExpertSkillsID FROM ExpertSkills es ";
		query += "INNER JOIN Experts e ON es.FK_ExpertID = e.ExpertID ";
		query += "INNER JOIN Skills s ON s.SkillID = es.FK_SkillID ";
		query += "WHERE es.ExpertSkillsID = ? ";
		sqlObj.setQuery(query, index);
		sqlObj.executeQuery('update_skill', rendObj, false);
		// sqlObj.executeQuery('update-expert-skills', rendObj, true);
	}

// Displays a list of experts or just a single profile
// You can click on each expert to get more info about them
module.exports = function () {
	var express = require('express');
	var router = express.Router();
	let sqlC = require('./sqlController.js');	// Page render and database interface
	let skills = require('./skills.js');		// Skills class obj
	let expert = require('./expert.js');		// Expert class obj
	let rend = require('./renderer.js');

	// Display all experts
	router.get('/', function (req, res) {
		var mysql = req.app.get('mysql');
		let sqlObj = new sqlC.sqlController( mysql);		// Set up SQL object
		let rendObj = new rend.Renderer(res, 5, 'experts'); // Display controller

		let skillObj = new skills.Skills(-1);				// Populate the skills
		skillObj.setUpSkills(rendObj, sqlObj, "");

		let expObj = new expert.Expert(-1);					// Get the expert profile
		expObj.getExperts(rendObj, sqlObj);
	});

	// Display information about a specifically selected expert
	router.get('/view/:id', function (req, res) {
		var mysql = req.app.get('mysql');
		var index = [req.params.id];
		let sqlObj = new sqlC.sqlController(mysql);
		let rendObj = new rend.Renderer(res, 9, 'profile'); // Display controller

		let skillObj1 = new skills.Skills(-1);				// Set up the profile's skills
		let skillObj2 = new skills.Skills(index);
		skillObj1.setUpSkills(rendObj, sqlObj, "");
		skillObj2.setUpSkills(rendObj, sqlObj, "profile_");

		let expObj = new expert.Expert(index);				// Set up the expert profile
		expObj.getExperts(rendObj, sqlObj);
	});

	















	// ====== Routers to update the expert personal info

	//gets the experts info and loads it into an update page
	router.get('/update/:id', function(req, res){
		var mysql = req.app.get('mysql');
		var index = [req.params.id];
		let sqlObj = new sqlC.sqlController(mysql);
		let rendObj = new rend.Renderer(res, 1, 'update-expert'); // Display controller

		let expObj = new expert.Expert(index);				// Set up the expert profile
		expObj.getExperts(rendObj, sqlObj);
	
	});

    //updates the information from the update expert page
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Experts SET Experts.FirstName=?, Experts.LastName=?, Experts.ProfileEmail=?, Experts.About=?, " + 
        		   "Experts.GithubLink=?, Experts.LinkedInLink=?, Experts.TwitterLink=?, Experts.ProfilePicture=? WHERE Experts.ExpertID=?";

        var inserts = [req.body.FirstName,req.body.LastName, req.body.ProfileEmail, req.body.About, req.body.GithubLink,  
        				req.body.LinkedInLink,  req.body.TwitterLink, req.body.ProfilePicture, req.params.id];

        sql = mysql.pool.query(sql, inserts,function(error, results, fields){
            if(error){
               console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });



	// ====== Routers to update the expert skill info

	//gets the experts skill and loads it into an update page
	router.get('/update-skill/:id', function(req, res){

		var mysql = req.app.get('mysql');
		var index = [req.params.id];
		let sqlObj = new sqlC.sqlController(mysql);

		let rendObj = new rend.Renderer(res, 1, 'update-expert-skills'); // Display controller

		getSingleSkillByID(sqlObj,rendObj, index);

		// let expObj = new expert.Expert(index);				// Set up the expert profile
		// expObj.getExperts(rendObj, sqlObj);
		/*
		var mysql = req.app.get('mysql');
		var index = [req.params.id];
		let sqlControls = new sqlC.sqlController(res, mysql);
		sqlControls.setUpIteration(1, 'update-expert-skills');

		getSingleSkillByID(sqlControls, index);

		*/


	});

    //updates the information from the update expert skill page
    router.put('/update-skill/:id', function(req, res){
        var mysql = req.app.get('mysql');
		var sql = "UPDATE ExpertSkills SET FK_ExpertID=?, FK_SkillID=(SELECT SkillID FROM Skills WHERE SkillName = ?), Experience=? WHERE ExpertSkillsID= ?";

 		var inserts = [req.body.ExpertID, req.body.name, req.body.Experience, req.body.ExpertSkillsID];

        sql = mysql.pool.query(sql, inserts,function(error, results, fields){
            if(error){
               console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });



	return router;
}();
