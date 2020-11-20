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



