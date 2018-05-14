var cfNodejsClient = require("cf-nodejs-client");

const CloudController = new (require("cf-nodejs-client")).CloudController(endpoint);
const UsersUAA = new (require("cf-nodejs-client")).UsersUAA;
const CloudApps = new (require("cf-nodejs-client")).Apps(endpoint);

// App functions
function appinfo(req, res, next) {
  let id = req.params.id;
  console.log(id);
}

function applist(req, res, next) {

  let format = req.query.format;

  CloudController.getInfo().then((result) => {
    UsersUAA.setEndPoint(result.authorization_endpoint);
    return UsersUAA.login(un, pw);
  }).then((result) => {
    CloudApps.setToken(result);
    CloudApps.getApps().then((resultApps) => {
      if (format == "JSON") {
        res.send(resultApps);
      } else {
        let appcount = resultApps.resources.length;
        // Render the response using the PUG template and passing in any required values
        res.render('apps', {
          title: 'Listing ' + appcount + " Apps",
          subtitle: 'at ' + endpoint,
          apps: resultApps.resources,
        });
      }
    });
    return "Apps Listed";
  }).then((result) => {
    console.log(result);
  }).catch((reason) => {
    console.error("Error: " + reason);
    res.error("Error: " + reason)
    return
  });
}

function appadd(req, res, next) {

  // var pushCommand = "cf push elbinapp --docker-image sanjeevkumar761/cf_ms:ElbinAbey";
  // http://localhost:3000/apps/add?imagename=cf_ms:rene&appname=rene2

  var imagename = req.query.imagename;
  var appname = req.query.appname;
  if (!imagename) {
    imagename = "sanjeevkumar761/cf_ms:rene"
  } else {
    imagename = "sanjeevkumar761/" + imagename
  };
  if (!appname) { appname = "deploytest" };
  var appoptions = {
    "name": appname,
    "space_guid": spaceid,
    "docker_image": imagename,
    "organization_guid": orgid,
    "start_command": "npm start",
    "requested_state": "STARTED",
    "instances": 1,
    "memory": 512
  }

  CloudController.getInfo().then((result) => {
    UsersUAA.setEndPoint(result.authorization_endpoint);
    return UsersUAA.login(un, pw);
  }).then((result) => {
    console.log("Adding " + appname + " from " + imagename);
    CloudApps.setToken(result);
    CloudApps.add(appoptions).then((resultAdd) => {
      res.send(resultAdd);
      return resultAdd;
    }).catch((reasonAdd) => {
      console.error("Error: " + reasonAdd);
      res.send("Error: " + reasonAdd)
      return
    })
  }).then((result) => {
    console.log(result);
  }).catch((reason) => {
    console.error("Error: " + reason);
    res.send("Error: " + reason)
    return
  });
}

function appupdate(req, res, next) {

  // var pushCommand = "cf push elbinapp --docker-image sanjeevkumar761/cf_ms:ElbinAbey";
  // http://localhost:3000/apps/add?imagename=cf_ms:rene&appname=rene2

  var imagename = req.query.imagename;
  var appname = req.query.appname;
  var appid = req.params.id;

  var appoptions = {}
  /*
  var appoptions = {
    "name": appname,
    "space_guid": spaceid,
    "docker_image": imagename,
    "organization_guid": orgid,
  }
  */
  

  console.log("updating " + appid);

  if (!appid) {
    res.send("No App Specified");
    return "No App Specified";
  }

  CloudController.getInfo().then((result) => {
    UsersUAA.setEndPoint(result.authorization_endpoint);
    return UsersUAA.login(un, pw);
  }).then((result) => {
    CloudApps.setToken(result);
    CloudApps.update(appid, appoptions).then((resultUpdate) => {
      res.send(resultUpdate);
      return resultUpdate;
    }).catch((reasonUpdate) => {
      console.error("Error: " + reasonUpdate);
      res.send("Error: " + reasonUpdate)
      return
    })
  }).then((result) => {
    console.log(result);
  }).catch((reason) => {
    console.error("Error: " + reason);
    res.send("Error: " + reason)
    return
  });
}

function appremove(req, res, next) {

  var appid = req.params.id;
  console.log("removing " + appid);

  if (!appid) {
    res.send("No App Specified");
    return "No App Specified";
  }

  CloudController.getInfo().then((result) => {
    UsersUAA.setEndPoint(result.authorization_endpoint);
    return UsersUAA.login(un, pw);
  }).then((result) => {
    CloudApps.setToken(result);
    CloudApps.remove(appid);
    res.send("App Removed");
    return "App Removed";
  }).then((result) => {
    console.log(result);
  }).catch((reason) => {
    console.error("Error: " + reason);
    res.send("Error: " + reason)
    return
  });
}

function appstart(req, res, next) {

  var appid = req.params.id;
  console.log("starting " + appid);

  if (!appid) {
    res.send("No App Specified");
    return "No App Specified";
  }

  CloudController.getInfo().then((result) => {
    UsersUAA.setEndPoint(result.authorization_endpoint);
    return UsersUAA.login(un, pw);
  }).then((result) => {
    CloudApps.setToken(result);
    CloudApps.start(appid);
    //Apps.remove(appID);
    res.send("App Started");
    return "App Started";
  }).then((result) => {
    console.log(result);
  }).catch((reason) => {
    console.error("Error: " + reason);
    res.send("Error: " + reason)
    return
  });
}

function appstop(req, res, next) {

  var appid = req.params.id;
  console.log("stopping " + appid);
  if (!appid) {
    res.send("No App Specified");
    return "No App Specified";
  }

  CloudController.getInfo().then((result) => {
    UsersUAA.setEndPoint(result.authorization_endpoint);
    return UsersUAA.login(un, pw);
  }).then((result) => {
    CloudApps.setToken(result);
    CloudApps.stop(appid);
    //Apps.remove(appID);
    res.send("App Stopped");
    return "App Stopped";
  }).then((result) => {
    console.log(result);
  }).catch((reason) => {
    console.error("Error: " + reason);
    res.send("Error: " + reason)
    return
  });
}

module.exports = {
  applist,
  appadd,
  appstart,
  appupdate,
  appstop,
  appremove
};