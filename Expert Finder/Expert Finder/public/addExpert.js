function showAlert() {
    alert('made it');
}


function addExpert() {
    var toServer = [];
    let table = document.getElementById("skills_table");
    for (var i = 1, row; row = table.rows[i]; i++) {
        toServer.push({
            Category: row.cells[0].textContent,
            Skill: row.cells[1].textContent,
            Experience: row.cells[3].textContent
        });
    }


    $.ajax({
        url: '/add-expert',
        type: 'PUT',
        data: {form: $('#add-expert').serialize(), table: toServer},
        success: function (result) {
            window.location.href = "/experts";
        }
    })
}
