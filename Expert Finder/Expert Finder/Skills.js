// Skills Class
// This contains the methods necessary to retrieve and use skill info

module.exports.Skills = class Skills {
	constructor(expertID) {
		this.expertID = expertID;		// The expert this set of skills applies to
		this.query = "";				// The query that will return info from the DB about this skill
		this.setCategory(1, 'skill');	// Set the type of skill initially to skills
	}

	// Add a skill to an experts portfolio. The skill is assigned to the expert with the corresponding expert id. 
	// You set the params array from the request body
	addSkill(sqlObj, params) {
		for (let index of params) {
			console.log("Exp: " + index.experience);
			var query = "INSERT INTO ExpertSkills (FK_ExpertID, FK_SkillID, Experience) VALUES (?, ?, ?)";
			var inserts = [this.expertID, index.skill, index.experience];
			sqlObj.setQuery(query, inserts);
			sqlObj.insertData(newfunc);
		}
		function newfunc(id) {
			return;
		}
    }

	// Returns the query that will be used to either get all skills in a category or all of the skills associated with a specific expert
	getSkills() {
		var query = "";
		if (this.expertID >= 0) {
			query = this.getSkillsByID();
		}
		else {
			query = this.getAllSkills();
		}
		return query;
	}

	// This updates the skill to a new category
	setCategory(cat, page) {
		this.category = cat;
		this.context = page;
		this.query = this.getSkills();
	}

	// Grabs the skills by expertID and categoryID
	getSkillsByID() {
		var query = "SELECT s.SkillName as name,  es.Experience, e.ExpertID FROM ExpertSkills es ";
		query += "INNER JOIN Experts e ON es.FK_ExpertID = e.ExpertID ";
		query += "INNER JOIN Skills s ON s.SkillID = es.FK_SkillID ";
		query += "WHERE s.FK_CategoryID = " + this.category + " AND e.ExpertID = ? ";
		return query;
}

	// Grabs all skills in the category associated with the class
	getAllSkills() {
		var query = "SELECT SkillID AS id, SkillName AS name FROM Skills WHERE FK_CategoryID = " + this.category;
		return query;
	}

	// Get all available skill categories
	getCategories() {
		var query = "SELECT CategoryID AS id, CategoryName AS name FROM SkillCategory";
		return query;
	}

	// Little helper function that makes it easy to setup the search bar
	setUpSkills(sqlObj, prefix = "") {
		sqlObj.setQuery(this.getCategories(), [0]);
		sqlObj.executeQuery('category', 2);

		this.skillGrabber(sqlObj, 1, prefix + 'skill');
		this.skillGrabber(sqlObj, 2, prefix + 'industry');
		this.skillGrabber(sqlObj, 3, prefix + 'course');
	}

	// Grab a set of skills and provide the context back for handlebars
	skillGrabber(sqlObj, index, profile) {
		this.setCategory(index, profile);
		sqlObj.setQuery(this.query, this.expertID);
		sqlObj.executeQuery(profile, 2);
	}
};