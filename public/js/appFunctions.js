
function appStart (guid) {
    alert ("Starting: "+guid);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "apps/start?appid="+guid, true);
    xhr.send();
}

function appStop (guid) {
    alert ("Stopping: "+guid);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "apps/stop?appid="+guid, true);
    xhr.send();
}

function appDelete (guid) {
    alert ("Deleting: "+guid);

}