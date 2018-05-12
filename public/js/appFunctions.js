function appAction(guid, url, m) {
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
    xhr.onerror = function err(data) {
        if (guid) messagetext.innerText = "Error " + m;
    }
    xhr.open('GET', url + guid, true);
    xhr.send();
}

function appStart(guid) {
    appAction(guid, "apps/start?appid=", "Starting App")
}

function appStop(guid) {
    appAction(guid, "apps/stop?appid=", "Stopping App")
}

function appDelete(guid) {
    let decision = confirm("Are you sure you want to delete app with GUID: "+guid+"?");
    if (decision) {
        appAction(guid, "apps/remove?appid=", "Deleting App")
    } else {
        let message = document.getElementById("message-" + guid);
        message.hide();
        return (false);
    }
}

function appAdd(imagename, appname) {

    if (!imagename) {
        // Get values from document
        imagename = document.getElementById("txtImageName").value;
        appname = document.getElementById("txtAppName").value;
    }

    let xhr = new XMLHttpRequest();
    let url = "apps/add?imagename=" + imagename + "&appname=" + appname
    xhr.onload = function loaded(data) {
        location.reload();
    }
    xhr.onerror = function err(data) {

    }
    xhr.open('GET', url, true);
    xhr.send();
}