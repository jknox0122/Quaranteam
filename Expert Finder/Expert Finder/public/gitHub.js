function executeFun(){
    const gitDetails = document.getElementById("gitLink").value;

    const xhr = new XMLHttpRequest();

    const url = 'https://api.github.com/users/'+gitDetails+'/repos';

    xhr.open('GET', url, true);

    xhr.onload = function(){
        const data = JSON.parse(this.response);
        console.log(data);
        var txt = gitDetails + " Repos: ";
        var tooltip = document.getElementById('tooltip');

        if (gitDetails == "git" || gitDetails == "Git" || gitDetails == null){
            txt = "No Github Account";
        } else {
            for(i in data){
                txt += data[i].name + " ";
            }
        }
        for(let i in data) {
            console.log('Repo:', data[i].name);
            console.log('==============')
            //alert(data[i].name)
        }
        tooltip.innerHTML = txt
    }

    xhr.send();
}