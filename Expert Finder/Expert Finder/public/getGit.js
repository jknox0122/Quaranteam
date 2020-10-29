function getGit(url, e) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    var data = JSON.parse(this.response);
    if (request.staus ?= 200 && request.status < 400) {

    } else {
        err = "API unavailable";
    }
    request.send();
}
