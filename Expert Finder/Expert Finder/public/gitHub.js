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
            tooltip.innerHTML = txt;
        } else{
        if(document.getElementById('check').id == 'check'){
            var lab = document.createElement('h3');
            var label = gitDetails + " Repositories";
            var ul = document.createElement('ul');
            var list = document.getElementById('tooltip');
            lab.innerHTML = label;
            ul.appendChild(lab);
            list.appendChild(ul);
        for(i = 0; i<5;i++){
        var anchor = document.createElement('a');
        var li = document.createElement('li');
        anchor.href = 'http://github.com/'+gitDetails+"/"+data[i].name;
        anchor.innerHTML = data[i].name;
        li.appendChild(anchor);
        list.appendChild(li);
        }
        var check = document.getElementById('check');
        check.id = "check1";
        }
    }
    }
    xhr.send();

}