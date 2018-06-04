let cfNodejsClient = require("cf-nodejs-client");

var dotenv = require('dotenv').config();
console.log ("CLOUD ENDPOINT: " + process.env.CICD_ENDPOINT)

//get environment variables
const endpoint = process.env.CICD_ENDPOINT;
const un = process.env.CICD_UN;
const pw = process.env.CICD_PW;
const spaceid = process.env.CICD_SPACEID;
const orgid = process.env.CICD_ORGID;
const domainid = process.env.CICD_DOMAINID;

//Setup clpud objects
const CloudController = new (require("cf-nodejs-client")).CloudController(endpoint);
const UsersUAA = new (require("cf-nodejs-client")).UsersUAA;
const CloudApps = new (require("cf-nodejs-client")).Apps(endpoint);
const CloudRoutes = new (require("cf-nodejs-client")).Routes(endpoint);

// App functions
async function getapps() {
  try {
    let info = await CloudController.getInfo();
    UsersUAA.setEndPoint(info.authorization_endpoint);
    let result = await UsersUAA.login(un, pw);
    CloudApps.setToken(result);
    let resultApps = await CloudApps.getApps();
    return (resultApps);
  } catch (error) {
    console.error(error);
    return (error);
  }
}

async function getappbyname(name) {
  let apps = await getapps();
  let appcount = apps.resources.length;

  for (let n = 0; n < appcount; n++) {
    let thisapp = apps[n];
    let thisname = thisapp.entity.name;
    if (thisname == name) {
      thisapp.name = thisapp.entity.name;
      thisapp.guid = app.metadata.guid;
      return (thisapp);
    }
  }
}

async function getappbyimage(image) {
  let apps = await getapps();
  let appcount = apps.resources.length;

  for (let n = 0; n < appcount; n++) {
    let thisapp = apps[n];
    let thisimage = thisapp.entity.docker_image;
    if (thisimage == image) {
      thisapp.name = thisapp.entity.name;
      thisapp.guid = app.metadata.guid;
      return (thisapp);
    }
  }
}

async function applistcontrol(req, res, next) {

  let format = req.query.format;
  console.log("getting apps list from: " + endpoint);
  let apps = await getapps();

  let appcount = apps.resources.length;
  // Render the response using the PUG template and passing in any required values
  if (res) res.render('apps', {
    title: "Hackathon SR Apps",
    apps: apps.resources,
  });
  return ("Apps rendered");
}

async function applist(req, res, next) {

  console.log("getting apps list from: " + endpoint);
  let apps = await getapps();
  if (res) res.send(apps);
}

async function appadd(req, res, next) {

  // let pushCommand = "cf push elbinapp --docker-image sanjeevkumar761/cf_ms:ElbinAbey";
  // http://localhost:3000/apps/add?imagename=cf_ms:rene&appname=rene2

  /* App push executes:
    1. get space uuid
    2. add app
    3. set route
    4. upload app
    5. start app
  */

  let imagename = req.body.imagename;
  let appname = req.body.appname;

  if (!imagename) {imagename = "sanjeevkumar761/cf_ms:rene"};

  if (!appname) { appname = "deploytest" };

  try {
    let info = await CloudController.getInfo();
    UsersUAA.setEndPoint(info.authorization_endpoint);
    let result = await UsersUAA.login(un, pw);
    CloudApps.setToken(result);
    CloudRoutes.setToken(result);

    let routeoptions = {
      "space_guid": spaceid,
      "domain_guid": domainid,
      "host": appname
    }
    let resultRoute = await CloudRoutes.add(routeoptions);

    let appoptions = {
      "name": appname,
      "space_guid": spaceid,
      "docker_image": imagename,
      "organization_guid": orgid,
      "start_command": "npm start",
      "requested_state": "STARTED",
      "instances": 1,
      "memory": 512
    }
    let resultAdd = await CloudApps.add(appoptions);
    //let resultRoute = await CloudRoutes.getRoutes();
    let routeid = resultRoute.metadata.guid;
    let appid = resultAdd.metadata.guid;
    let resultAssoc = await CloudApps.associateRoute(appid, routeid);
    let resultOp = await CloudApps.start (appid);

    if (res) res.send(resultOp);
    return (resultOp);
  } catch (error) {
    if (res) res.status(500)
    if (res) res.send(error);
    console.error(error);
  }

}

async function appupdate(req, res, next) {

  let imagename = req.query.imagename;
  let appname = req.query.appname;
  let appid = req.params.id;
  let appoptions = {}
  console.log("updating " + appid);

  if (!appid) {
    res.send("No App Specified");
    return "No App Specified";
  }

  try {
    let info = await CloudController.getInfo();
    UsersUAA.setEndPoint(info.authorization_endpoint);
    let result = await UsersUAA.login(un, pw);
    CloudApps.setToken(result);
    let resultOp = await CloudApps.update(appid, appoptions);
    if (res) res.send(resultOp);
    return (resultOp);
  } catch (error) {
    if (res) res.status(500)
    if (res) res.send(error);
    console.error(error);
    return (error);
  }
}

async function appremove(req, res, next) {

  let appid = req.params.id;
  console.log("removing " + appid);

  try {
    let resultOp = await appremovebyid(appid);
    res.send(resultOp);
    console.log(resultOp);
    return (resultOp);
  } catch (error) {
    res.status(500)
    res.send(error);
    console.error(error);
    return (error);
  }
}

async function appremovebyid(appid) {
  if (!appid) return "No App Specified";
  try {
    let info = await CloudController.getInfo();
    UsersUAA.setEndPoint(info.authorization_endpoint);
    let result = await UsersUAA.login(un, pw);
    CloudApps.setToken(result);
    let resultOp = await CloudApps.remove(appid);
    return (resultOp);
  } catch (error) {
    return (error);
  }
}

async function appstart(req, res, next) {

  let appid = req.params.id;
  console.log("starting " + appid);

  if (!appid) {
    res.send("No App Specified");
    return "No App Specified";
  }

  try {
    let info = await CloudController.getInfo();
    UsersUAA.setEndPoint(info.authorization_endpoint);
    let result = await UsersUAA.login(un, pw);
    CloudApps.setToken(result);
    let resultOp = await CloudApps.start(appid);
    if (res) res.send(resultOp);
    return (resultOp);
  } catch (error) {
    if (res) res.status(500)
    if (res) res.send(error);
    console.error(error);
    return (error);
  }
}

async function appstop(req, res, next) {

  let appid = req.params.id;
  console.log("stopping " + appid);
  if (!appid) {
    if (res) res.send("No App Specified");
    return "No App Specified";
  }

  try {
    let info = await CloudController.getInfo();
    UsersUAA.setEndPoint(info.authorization_endpoint);
    let result = await UsersUAA.login(un, pw);
    CloudApps.setToken(result);
    let resultOp = await CloudApps.stop(appid);
    if (res) res.send(resultOp);
    return (resultOp);
  } catch (error) {
    if (res) res.status(500)
    if (res) res.send(error);
    console.error(error);
    return (error);
  }
}

module.exports = {
  applist,
  applistcontrol,
  appadd,
  appstart,
  appupdate,
  appstop,
  appremove,
  getapps,
  getappbyname,
  getappbyimage,
  appremovebyid
};