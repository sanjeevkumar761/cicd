function appaction(guid, action, m) {
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
    xhr.open('GET', url, true);
    xhr.send();
}

function appstart(guid) {
    appaction(guid, "start", "Starting App")
}

function appstop(guid) {
    appaction(guid, "stop", "Stopping App")
}

function appupdate(guid) {
    appaction(guid, "update", "Updating App")
}

function appdelete(guid) {
    let decision = confirm("Are you sure you want to delete app with GUID: " + guid + "?");
    if (decision) {
        appaction(guid, "remove", "Deleting App")
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
        let url = "/apps/add?imagename=" + imagename + "&appname=" + appname
        xhr.onload = function loaded(data) {
            messagetext.innerText = "Added new app: " + appname + " from image: " + imagename + " (refreshing App list...)";
            location.reload();
        }
        xhr.onerror = function err(data) {
            messagetext.innerText = "Error adding new app: " + appname + " from image: " + imagename;
        }
        xhr.open('GET', url, true);
        xhr.send();
    }
}