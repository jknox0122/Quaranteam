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

function updateExpertSkills(id){
	console.log("UPDATING EXPERT");
    $.ajax({
        url: '/experts/update-skill/' + id,
        type: 'PUT',
        data: $('#update-expert-skills').serialize(),
        success: function(result){
            window.location.replace("/experts/view/" + id);
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