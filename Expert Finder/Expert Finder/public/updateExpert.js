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
