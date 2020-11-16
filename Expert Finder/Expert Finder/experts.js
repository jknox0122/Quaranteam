module.exports = function () {
	var express = require('express');
	var router = express.Router();
	let sqlC = require('./sqlController.js');
	let skills = require('./skills.js');

	// Name: getExperts
	// Description: Get profile information
	function getExperts(sqlObj) {
		var query = "SELECT * FROM Experts";
		sqlObj.setQuery(query, [0]);
		sqlObj.executeQuery('expert', 2);
	}

	// Name: getExpertsbyID
	// Description: Get Experts by ID number - used to view profile information
	function getExpertByID(sqlObj, index) {
		var query = "SELECT * FROM Experts WHERE ExpertID = ?";
		sqlObj.setQuery(query, index);
		sqlObj.executeQuery('selected_expert', 1);
	}


	// Display all experts
	router.get('/', function (req, res) {
		var mysql = req.app.get('mysql');
		let sqlObj = new sqlC.sqlController(res, mysql);
		let skillObj = new skills.Skills(-1);
		sqlObj.setUpIteration(5, 'experts');
		skillObj.setUpSkills(sqlObj, "");
		getExperts(sqlObj);
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

	// Display information about a specifically selected author
	router.get('/view/:id', function (req, res) {
		console.log("EXPERT VIEW ID");

		var mysql = req.app.get('mysql');
		var index = [req.params.id];
		let sqlObj = new sqlC.sqlController(res, mysql);
		let skillObj1 = new skills.Skills(-1);
		let skillObj2 = new skills.Skills(index);
		sqlObj.setUpIteration(8, 'profile');
		skillObj1.setUpSkills(sqlObj, "");
		skillObj2.skillGrabber(sqlObj, 1, 'profile_skill');
		skillObj2.skillGrabber(sqlObj, 2, 'profile_industry');
		skillObj2.skillGrabber(sqlObj, 3, 'profile_course');
		getExpertByID(sqlObj, index);
	});





	return router;
}();
