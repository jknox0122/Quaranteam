function updateExpert(id){
	console.log("UPDATING EXPERT");
    $.ajax({
        url: '/experts/' + id,
        type: 'PUT',
        data: $('#update-expert').serialize(),
        success: function(result){
            window.location.replace("/experts/view/" + id);
        }
    })
};

function updateExpertSkills(id, expertID){
    console.log("UPDATING EXPERT");
    $.ajax({
        url: '/experts/update-skill/' + id,
        type: 'PUT',
        data: $('#update-expert-skills').serialize(),
        success: function(result){
            window.location.replace("/experts/view/" + expertID);
        }
    })
};



function addExpertSkill(id){
    console.log("~~~~~~~ !!!!!!!!!!!!!! Adding EXPERT SKILL");
    $.ajax({
        url: '/experts/skills/' + id,
        type: 'PUT',
        data: $('#add-skill').serialize(),
        success: function(result){
            window.location.replace("/experts/view/" + id);
        }
    })
};



        


var mytextbox = document.getElementById('skillIDSelected');
var mydropdown = document.getElementById('add_skills');
var mydropdown2 = document.getElementById('add_industry');
var mydropdown3 = document.getElementById('add_course');

categorydropdown = document.getElementById('add_category');

categorydropdown.onchange = function () {
    var cat = this.value;
    if (cat == 1) {
        mydropdown.hidden = false;
        mydropdown2.hidden = true;
        mydropdown3.hidden = true;
        mytextbox.value = mydropdown.value; //to appened
    }
    else if (cat == 2) {
        mydropdown.hidden = true;
        mydropdown2.hidden = false;
        mydropdown3.hidden = true;
        mytextbox.value = mydropdown2.value; //to appened
    }
    else if (cat == 3) {
        mydropdown.hidden = true;
        mydropdown2.hidden = true;
        mydropdown3.hidden = false;
        mytextbox.value = mydropdown3.value; //to appened
    }
}

mydropdown.onchange = function(){
    console.log("A CHANGE!");
      mytextbox.value = this.value; //to appened
     //mytextbox.innerHTML = this.value;
 }

 mydropdown2.onchange = function(){
    console.log("A CHANGE!");
      mytextbox.value = this.value; //to appened
     //mytextbox.innerHTML = this.value;
 }

 mydropdown3.onchange = function(){
    console.log("A CHANGE!");
      mytextbox.value = this.value; //to appened
     //mytextbox.innerHTML = this.value;
 }