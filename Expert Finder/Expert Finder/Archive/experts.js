
module.exports = function () {
	var express = require('express');
	var router = express.Router();
	let sqlC = require('./sqlController.js');

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
	function getSingleSkillByID(sqlObj, index) {
		var query = "SELECT s.SkillName as name,  es.Experience, e.ExpertID, es.ExpertSkillsID, e.ProfilePicture FROM ExpertSkills es ";
		query += "INNER JOIN Experts e ON es.FK_ExpertID = e.ExpertID ";
		query += "INNER JOIN Skills s ON s.SkillID = es.FK_SkillID ";
		query += "WHERE es.ExpertSkillsID = ? ";
		sqlObj.setQuery(query, index);
		sqlObj.executeQuery('update_skill', 1);

	}

	// Name: getSkillsbyID
	// Description: Get Skills by ID number - used to view profile information
	// Parameters: res - response object, id - the ID of the expert, mysql - node sql object, context - results being passed to handlebars, 
	// complete - function to count the number of loops through objects to we know when to render the page
	function getSkillsByID(sqlObj, index) {
		var query = "SELECT s.SkillName as name,  es.Experience, e.ExpertID, es.ExpertSkillsID FROM ExpertSkills es ";
		query += "INNER JOIN Experts e ON es.FK_ExpertID = e.ExpertID ";
		query += "INNER JOIN Skills s ON s.SkillID = es.FK_SkillID ";
		query += "WHERE s.FK_CategoryID = 1 AND e.ExpertID = ? ";
		sqlObj.setQuery(query, index);
		sqlObj.executeQuery('profile_skill', 2);
	}

	// Name: getCoursebyID
	// Description: Get Courses by ID number - used to view profile information
	// Parameters: res - response object, id - the ID of the expert, mysql - node sql object, context - results being passed to handlebars, 
	// complete - function to count the number of loops through objects to we know when to render the page
	function getCoursesByID(sqlObj, index) {
		var query = "SELECT s.SkillName as name, es.Experience, e.ExpertID, es.ExpertSkillsID FROM ExpertSkills es ";
		query += "INNER JOIN Experts e ON es.FK_ExpertID = e.ExpertID ";
		query += "INNER JOIN Skills s ON s.SkillID = es.FK_SkillID ";
		query += "WHERE s.FK_CategoryID = 3 AND e.ExpertID = ? ";
		sqlObj.setQuery(query, index);
		sqlObj.executeQuery('profile_course', 2);
	}

	// Name: getIndustryByID
	// Description: Get Industry by ID number - used to view profile information
	// Parameters: res - response object, id - the ID of the expert, mysql - node sql object, context - results being passed to handlebars, 
	// complete - function to count the number of loops through objects to we know when to render the page
	function getIndustryByID(sqlObj, index) {
		var query = "SELECT s.SkillName as name, es.Experience, e.ExpertID, es.ExpertSkillsID FROM ExpertSkills es ";
		query += "INNER JOIN Experts e ON es.FK_ExpertID = e.ExpertID ";
		query += "INNER JOIN Skills s ON s.SkillID = es.FK_SkillID ";
		query += "WHERE s.FK_CategoryID = 2 AND e.ExpertID = ? ";
		sqlObj.setQuery(query, index);
		sqlObj.executeQuery('profile_industry', 2);
	}


	// Name: getCategories
	// Description: Use this function to display the various search categories
	function getCategories(sqlControl) {
		query = "SELECT CategoryID AS id, CategoryName AS name FROM SkillCategory";
		sqlControl.setQuery(query, [0]);
		sqlControl.executeQuery('category', 2)
	}

	// Name: getSkills
	// Description: Use this function to display the available skills
	function getSkill(sqlControl, context, index) {
		query = "SELECT SkillID AS id, SkillName AS name FROM Skills WHERE FK_CategoryID = ?";
		sqlControl.setQuery(query, index);
		sqlControl.executeQuery(context, 2)
	}

	// Display all experts
	router.get('/', function (req, res) {
		var mysql = req.app.get('mysql');
		let sqlControls = new sqlC.sqlController(res, mysql);
		sqlControls.setUpIteration(5, 'experts');
		getCategories(sqlControls);
		getSkill(sqlControls, 'skill', 1);
		getSkill(sqlControls, 'industry', 2)
		getSkill(sqlControls, 'course', 3)
		getExperts(sqlControls);

	});



	// ====== Routers to update the expert personal info

	//gets the experts info and loads it into an update page
	router.get('/update/:id', function(req, res){
		var mysql = req.app.get('mysql');
		var index = [req.params.id];
		let sqlControls = new sqlC.sqlController(res, mysql);
		sqlControls.setUpIteration(1, 'update-expert');

		getExpertByID(sqlControls, index);
	
	});

    //updates the information from the update expert page
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Experts SET Experts.FirstName=?, Experts.LastName=?, Experts.ProfileEmail=?, Experts.About=?, " + 
        		   "Experts.GithubLink=?, Experts.LinkedInLink=?, Experts.TwitterLink=? WHERE Experts.ExpertID=?";

        var inserts = [req.body.FirstName,req.body.LastName, req.body.ProfileEmail, req.body.About, req.body.GithubLink,  
        				req.body.LinkedInLink,  req.body.TwitterLink, req.params.id];

        console.log("INSERTS: " + inserts);

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
		let sqlControls = new sqlC.sqlController(res, mysql);
		sqlControls.setUpIteration(1, 'update-expert-skills');

		getSingleSkillByID(sqlControls, index);

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


	// Display information about a specifically selected author
	router.get('/view/:id', function (req, res) {
		console.log("EXPERT VIEW ID");

		var mysql = req.app.get('mysql');
		var index = [req.params.id];
		let sqlControls = new sqlC.sqlController(res, mysql);
		sqlControls.setUpIteration(8, 'profile');

		getCategories(sqlControls);
		getSkill(sqlControls, 'skill', 1);
		getSkill(sqlControls, 'industry', 2)
		getSkill(sqlControls, 'course', 3)

		getExpertByID(sqlControls, index);
		getSkillsByID(sqlControls,index);
		getCoursesByID(sqlControls, index);
		getIndustryByID(sqlControls, index);
	});





	return router;
}();
