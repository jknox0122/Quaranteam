module.exports = function () {
	var express = require('express');
	var router = express.Router();
	let sqlC = require('./sqlController.js');	// Page render and database interface
	let skills = require('./skills.js');		// Skills class obj
	let expert = require('./expert.js');		// Expert class obj
    let rend = require('./renderer.js');
    let upload = require('./server.js');
    /*router.get('/', function (req, res) {
		res.render('photo-upload');
    });*/

    /*router.get('/:id', function (req, res) {
        var mysql = req.app.get('mysql');
		var index = [req.params.id];
		let sqlObj = new sqlC.sqlController(mysql);
		let rendObj = new rend.Renderer(res, 9, 'photo-upload'); // Display controller

		let skillObj1 = new skills.Skills(-1);				// Set up the profile's skills
		let skillObj2 = new skills.Skills(index);
		skillObj1.setUpSkills(rendObj, sqlObj, "");
		skillObj2.setUpSkills(rendObj, sqlObj, "profile_");

		let expObj = new expert.Expert(index);				// Set up the expert profile
		expObj.getExperts(rendObj, sqlObj);
       // res.render('./photo-upload');
    });*/
    
    router.get('/:fName/:lName', function (req, res) {
        var mysql = req.app.get('mysql');
        var index = [req.params.fName, req.params.lName];
		let sqlObj = new sqlC.sqlController(mysql);
		let rendObj = new rend.Renderer(res, 9, 'photo-upload'); // Display controller

		let skillObj1 = new skills.Skills(-1);				// Set up the profile's skills
		let skillObj2 = new skills.Skills(index);
		skillObj1.setUpSkills(rendObj, sqlObj, "");
        skillObj2.setUpSkills(rendObj, sqlObj, "profile_");
        
        let expObj = new expert.Expert(index);				// Set up the expert profile
		expObj.getExpertsByName(rendObj, sqlObj);
       // res.render('./photo-upload');
    });
    
    router.post('/upload/:id', (req,res) => {
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Experts SET ProfilePicture = ? WHERE ExpertID = ?";
        upload.upload(req , res, (err) => {
            if(err){
                res.render('photo-upload', {
                    msg: err
                });
            } else {
                console.log(req.file.filename);
                var inserts = [req.file.filename, req.params.id];
                sql = mysql.pool.query(sql, inserts,function(error,results,fields){
                    if(error){
                        res.write(JSON.stringify(error));
                        res.end();
                    } else{
                        console.log("!!!!PHOTO IN DATABASE!!!");
                        res.redirect('/experts/view/'+ req.params.id);
                    }
                })
            }
        });
    });

    return router;

}();