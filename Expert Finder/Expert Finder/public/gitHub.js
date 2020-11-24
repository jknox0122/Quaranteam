var check = 0;

function executeFun(){
    const gitDetails = document.getElementById("gitLink").value;
    const xhr = new XMLHttpRequest();

    const url = 'https://api.github.com/users/'+gitDetails+'/repos';

    xhr.open('GET', url, true);

    xhr.onload = function(){
        const data = JSON.parse(this.response);
        var txt = gitDetails + " Repos: ";
        var tooltip = document.getElementById('tooltip');

        if (gitDetails == "git" || gitDetails == "Git" || gitDetails == null){
            txt = "No Github Account";
            tooltip.innerHTML = txt;
        } else{
            if(check == 0){
                var lab = document.createElement('h3');
                var label = gitDetails + " Repositories";
                var ul = document.createElement('ul');
                var list = document.getElementById('tooltip');
                lab.innerHTML = label;
                ul.appendChild(lab);
                list.appendChild(ul);
                for(let i in data){
                    var anchor = document.createElement('a');
                    var li = document.createElement('li');
                    anchor.href = 'http://github.com/'+gitDetails+"/"+data[i].name;
                    anchor.innerHTML = data[i].name;
                    li.appendChild(anchor);
                    list.appendChild(li);
                }
                check++;
                console.log(check);
            }
        }
    }
    xhr.send();
}