
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

	// Name: getSkillsbyID
	// Description: Get Skills by ID number - used to view profile information
	// Parameters: res - response object, id - the ID of the expert, mysql - node sql object, context - results being passed to handlebars, 
	// complete - function to count the number of loops through objects to we know when to render the page
	function getSkillsByID(sqlObj, index) {
		var query = "SELECT s.SkillName, sk.CategoryName, es.Experience, e.ExpertID FROM ExpertSkills es ";
		query += "INNER JOIN Experts e ON es.FK_ExpertID = e.ExpertID ";
		query += "INNER JOIN Skills s ON s.SkillID = es.FK_SkillID ";
		query += "INNER JOIN SkillCategory sk ON sk.CategoryID = s.FK_CategoryID ";
		query += "WHERE sk.CategoryName = 'Skill' AND e.ExpertID = ? ";
		sqlObj.setQuery(query, index);
		sqlObj.executeQuery('skills', 2);
	}

	// Name: getCoursebyID
	// Description: Get Courses by ID number - used to view profile information
	// Parameters: res - response object, id - the ID of the expert, mysql - node sql object, context - results being passed to handlebars, 
	// complete - function to count the number of loops through objects to we know when to render the page
	function getCoursesByID(sqlObj, index) {
		var query = "SELECT s.SkillName, sk.CategoryName, es.Experience, e.ExpertID FROM ExpertSkills es ";
		query += "INNER JOIN Experts e ON es.FK_ExpertID = e.ExpertID ";
		query += "INNER JOIN Skills s ON s.SkillID = es.FK_SkillID ";
		query += "INNER JOIN SkillCategory sk ON sk.CategoryID = s.FK_CategoryID ";
		query += "WHERE sk.CategoryName = 'Course' AND e.ExpertID = ? ";
		sqlObj.setQuery(query, index);
		sqlObj.executeQuery('courses', 2);
	}

	// Name: getIndustryByID
	// Description: Get Industry by ID number - used to view profile information
	// Parameters: res - response object, id - the ID of the expert, mysql - node sql object, context - results being passed to handlebars, 
	// complete - function to count the number of loops through objects to we know when to render the page
	function getIndustryByID(sqlObj, index) {
		var query = "SELECT s.SkillName, sk.CategoryName, es.Experience, e.ExpertID FROM ExpertSkills es ";
		query += "INNER JOIN Experts e ON es.FK_ExpertID = e.ExpertID ";
		query += "INNER JOIN Skills s ON s.SkillID = es.FK_SkillID ";
		query += "INNER JOIN SkillCategory sk ON sk.CategoryID = s.FK_CategoryID ";
		query += "WHERE sk.CategoryName = 'Industry' AND e.ExpertID = ? ";
		sqlObj.setQuery(query, index);
		sqlObj.executeQuery('industry', 2);
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

	// Display information about a specifically selected author
	router.get('/view/:id', function (req, res) {
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
