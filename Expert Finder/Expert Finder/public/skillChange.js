
function showSkills(page) {
     var cat = document.getElementById(page + "_category").value;
    if (cat == 1) {
        document.getElementById(page + "_skills").hidden = false;
        document.getElementById(page + "_industry").hidden = true;
        document.getElementById(page + "_course").hidden = true;
    }
    else if (cat == 2) {
        document.getElementById(page + "_skills").hidden = true;
        document.getElementById(page + "_industry").hidden = false;
        document.getElementById(page + "_course").hidden = true;
    }
    else if (cat == 3) {
        document.getElementById(page + "_skills").hidden = true;
        document.getElementById(page + "_industry").hidden = true;
        document.getElementById(page + "_course").hidden = false;
    }
}

function searchSkills(page) {
    var cat = document.getElementById(page + "_category").value;
    if (cat == 1) {
        var skill = document.getElementById(page +"_skills").value;
    }
    else if (cat == 2) {
        var skill = document.getElementById(page +"_industry").value;
    }
    else if (cat == 3) {
        var skill = document.getElementById(page + "_course").value;
    }
    var query = ("/search/results/" + encodeURIComponent(skill));
    window.location = query;
}

function addSkill() {
    let table = document.getElementById("skills_table");
    var cat = document.getElementById("add_category").value;

    if (cat == 1) {
        var index = "add_skills";
    }
    else if (cat == 2) {
        var index = "add_industry";
    }
    else if (cat == 3) {
        var index = "add_course";
    }

    var skillID = document.getElementById(index).value;
    var skillValue = document.getElementById(index).selectedIndex;
    var skillName = document.getElementById(index).options[skillValue].text;
    let experience = document.getElementById("experience").value;

    var rowFound = -1;
    for (var i = 0, row; row = table.rows[i]; i++) {
        if (row.cells[0].textContent == cat && row.cells[1].textContent == skillID) {
            rowFound = i;
        } 
    }

    if (rowFound > 0) {
        table.rows[rowFound].cells[3].textContent = experience
    }
    else {
        let row = table.insertRow(-1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);

        cell1.appendChild(document.createTextNode(cat));
        cell2.appendChild(document.createTextNode(skillID));
        cell3.appendChild(document.createTextNode(skillName));
        cell4.appendChild(document.createTextNode(experience));

        cell1.hidden = true;
        cell2.hidden = true;
        table.hidden = false;
    }
}