function executeFun(){
    const gitDetails = document.getElementById("gitLink").value;

    const xhr = new XMLHttpRequest();

    const url = 'https://api.github.com/users/'+gitDetails+'/repos';

    xhr.open('GET', url, true);

    xhr.onload = function(){
        const data = JSON.parse(this.response);
        console.log(data);
       
        for(let i in data) {
            console.log('Repo:', data[i].name);
            console.log('==============')
            //alert(data[i].name)
        }

        var tooltip = document.getElementById('tooltip');
        var txt = gitDetails + " Repos: ";
        for(i in data){
            txt += data[i].name + " ";
        }

        tooltip.innerHTML = txt
    }

    xhr.send();
}