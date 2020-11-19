function addExpert() {
    var skillset = [];
    var expert = {};
    let table = document.getElementById("skills_table");
    for (var i = 1, row; row = table.rows[i]; i++) {
        skillset.push({
            category: row.cells[0].textContent,
            skill: row.cells[1].textContent,
            experience: row.cells[3].textContent
        });
    }

    var first_name = document.getElementById('fname').value;
    if (first_name != "") {
        expert['fname'] = first_name;
    }

    var last_name = document.getElementById('lname').value;
    if (last_name != "") {
        expert['lname'] = last_name;
    }

    var about = document.getElementById('about').value;
    if (about != "") {
        expert['about'] = about;
    }

    var email = document.getElementById('email').value;
    if (email != "") {
        expert['email'] = email;
    }

    var git = document.getElementById('git').value;
    if (git != "") {
        expert['git'] = git;
    }

    var linkedin = document.getElementById('linkedin').value;
    if (linkedin != "") {
        expert['linkedin'] = linkedin;
    }

    var twitter = document.getElementById('twitter').value;
    if (twitter != "") {
        expert['twitter'] = twitter;
    }

    $.ajax({
        url: '/add-expert',
        type: 'PUT',
        data: { expert: expert, skillset: skillset },
        success: function (result) {
            window.location.href = "/experts";
        }
    });
}
