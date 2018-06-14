function appaction(guid, action, m, type) {

/*  More modern fetch request not working in IE

    fetch(url).then(function(response) {
        response.text().then(function(text) {
          poemDisplay.textContent = text;
        });
      });
*/

    if (!type) type = "GET"
    let xhr = new XMLHttpRequest();
    let messagetext;
    if (guid) {
        messagetext = document.getElementById("messagetext-" + guid).firstChild;
        messagetext.innerText = m;
    }
    xhr.onload = function loaded(data) {
        if (guid) messagetext.innerText = "Completed " + m + " (refreshing App list...)";
        location.reload();
    }
    xhr.onerror = function err() {
        if (guid) messagetext.innerText = "Error: " + this.statusText;
    }
    let url = "/apps/" + guid + "/" + action;
    xhr.open(type, url, true);
    xhr.send();
}

function appstart(guid) {
    appaction(guid, "start", "Starting App", "PATCH")
}

function appstop(guid) {
    appaction(guid, "stop", "Stopping App", "PATCH")
}

function appupdate(guid) {
    appaction(guid, "", "Updating App", "PUT")
}

function appdelete(guid) {
    let decision = confirm("Are you sure you want to delete app with GUID: " + guid + "?");
    if (decision) {
        appaction(guid, "", "Deleting App", "DELETE")
    } else {
        let message = document.getElementById("message-" + guid);
        message.hide();
        return (false);
    }
}

function appadd(imagename, appname) {

    if (!imagename) {
        // Get values from document
        imagename = document.getElementById("txtImageName").value;
        appname = document.getElementById("txtAppName").value;
    }

    if ((appname != "") && (imagename != "")) {
        messagetext = document.getElementById("messagetext-new").firstChild;
        messagetext.innerText = "Trying to add new app: " + appname + " from image: " + imagename;
        let xhr = new XMLHttpRequest();
        let url = "/apps/add";
        let data = {};
        data.appname = appname;
        data.imagename = imagename;
        let jsondata = JSON.stringify(data);
        
        xhr.onload = function loaded(data) {
            messagetext.innerText = "Added new app: " + appname + " from image: " + imagename + " (refreshing App list...)";
            location.reload();
        }
        xhr.onerror = function err(data) {
            messagetext.innerText = "Error adding new app: " + appname + " from image: " + imagename;
        }
        // change to put and add payload
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(jsondata);
        
    }
}