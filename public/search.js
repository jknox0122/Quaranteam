function searchSkill(index) {
    var expert = document.getElementById('searchvalue').value
    //construct the URL and redirect to it
    window.location = '/search/' + encodeURI(expert) + '/' + encodeURI(search)
}

