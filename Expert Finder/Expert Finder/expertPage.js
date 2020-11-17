// Displays a list of experts or just a single profile
// You can click on each expert to get more info about them
module.exports = function () {
	var express = require('express');
	var router = express.Router();
	let sqlC = require('./sqlController.js');	// Page render and database interface
	let skills = require('./skills.js');		// Skills class obj
	let expert = require('./expert.js');		// Expert class obj

	// Display all experts
	router.get('/', function (req, res) {
		var mysql = req.app.get('mysql');
		let sqlObj = new sqlC.sqlController(res, mysql);	// Set up page rendering
		sqlObj.setUpIteration(5, 'experts');

		let skillObj = new skills.Skills(-1);		// Populate the skills
		skillObj.setUpSkills(sqlObj, "");

		let expObj = new expert.Expert(-1);			// Get the expert profile
		expObj.getExperts(sqlObj);
	});


	// ===================================================
	router.get('/update/:id', function(req, res){
	console.log("Attempting to update");
		var mysql = req.app.get('mysql');
		var index = [req.params.id];
		let sqlControls = new sqlC.sqlController(res, mysql);
		sqlControls.setUpIteration(1, 'update-expert');

		// getCategories(sqlControls);
		// getSkill(sqlControls, 'skill', 1);
		// getSkill(sqlControls, 'industry', 2)
		// getSkill(sqlControls, 'course', 3)

		getExpertByID(sqlControls, index);
		// getSkillsByID(sqlControls,index);
		// getCoursesByID(sqlControls, index);
		// getIndustryByID(sqlControls, index);

	});

    // Router to update artifact
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Experts SET Experts.FirstName=?, Experts.LastName=?, Experts.ProfileEmail=?, Experts.About=?, " + 
        		   "Experts.GithubLink=?, Experts.LinkedInLink=?, Experts.TwitterLink=? WHERE Experts.ExpertID=?";

        var inserts = [req.body.FirstName,req.body.LastName, req.body.ProfileEmail, req.body.About, req.body.GithubLink,  req.body.LinkedInLink,  req.body.TwitterLink, req.params.id];

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

	// Display information about a specifically selected expert
	router.get('/view/:id', function (req, res) {
		var mysql = req.app.get('mysql');
		var index = [req.params.id];
		let sqlObj = new sqlC.sqlController(res, mysql);	// Set up the rendering class
		sqlObj.setUpIteration(9, 'profile');

		let skillObj1 = new skills.Skills(-1);				// Set up the profile's skills
		let skillObj2 = new skills.Skills(index);
		skillObj1.setUpSkills(sqlObj, "");
		skillObj2.setUpSkills(sqlObj, "profile_");

		let expObj = new expert.Expert(index);				// Set up the expert profile
		expObj.getExperts(sqlObj);
	});

	return router;
}();
