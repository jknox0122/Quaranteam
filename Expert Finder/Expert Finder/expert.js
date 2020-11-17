// Expert Class
// This contains the methods necessary to retrieve and manage experts

module.exports.Expert = class Expert {
	constructor(expertID) {
		this.expertID = expertID
		this.sql_construct = {}
	}

	getExperts(sqlObj) {
		var query = "SELECT * FROM Experts";
		var index = 2;
		var profile = 'expert';
		if (this.expertID >= 0) {
			query += " WHERE ExpertID = ?";
			index = 1;
			profile = 'selected_expert';
		}
		sqlObj.setQuery(query, [this.expertID]);
		sqlObj.executeQuery(profile, index);
	}

	// Builds a profile for inserting new experts
	profileBuilder(prof, txt) {
		if (prof) {
			this.sql_construct.sql1 += ", " + txt;
			this.sql_construct.sql2 += ",?";
			this.sql_construct.inserts.push(prof);
		}
	}

	// Add an expert to the database
	addExpert(params) {
		var sql;
		this.sql_construct.sql1 = "INSERT INTO Experts (FirstName, LastName";
		this.sql_construct.sql2 = " VALUES (?,?";
		this.sql_construct.inserts = [params.fname, params.lname];

		this.profileBuilder(params.email, "ProfileEmail");
		this.profileBuilder(params.twitter, "TwitterLink");
		this.profileBuilder(params.linkedin, "LinkedInLink");
		this.profileBuilder(params.git, "GithubLink");
		this.profileBuilder(params.about, "About");
		this.sql_construct.sql1 += ")"
		this.sql_construct.sql2 += ")"
		sql = this.sql_construct.sql1 + this.sql_construct.sql2;
		return sql;
	}

};