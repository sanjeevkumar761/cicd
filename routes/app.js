"use strict";

var express = require('express');
var cfNodejsClient = require("cf-nodejs-client")
var router = express.Router();

const endpoint = "https://api.cf.eu10.hana.ondemand.com";
const username = "sanjeev_kumar@rcomext.com";
const password = "Hackathon8%2";
 
const CloudController = new (require("cf-nodejs-client")).CloudController(endpoint);
const UsersUAA = new (require("cf-nodejs-client")).UsersUAA;
const Apps = new (require("cf-nodejs-client")).Apps(endpoint);


const spaceID = "79a6cdb5-296b-46bd-b28a-a433492009de";
const orgID = "53f33523-70ab-4c1a-b8ac-bfb233a0d853";
var appID = "d1d5bf9e-ecbd-4670-a3bf-7200bbe20228";

router.get('/', function(req, res, next) {

  CloudController.getInfo().then( (result) => {
    UsersUAA.setEndPoint(result.authorization_endpoint);
    return UsersUAA.login(username, password);
  }).then( (result) => {
    Apps.setToken(result);
    res.send(Apps.getApps());
    return "App Listed";
  }).then( (result) => {
    console.log(result);
  }).catch( (reason) => {
    console.error("Error: " + reason);
    res.send ("Error: " + reason)
    return
  });
  
});


router.get('/add', function(req, res, next) {

  // var pushCommand = "cf push elbinapp --docker-image sanjeevkumar761/cf_ms:ElbinAbey";

  var imageName = req.query.imageName;
  var appName = req.query.appName;
  if (imageName=="") { imageName = "sanjeevkumar761/cf_ms:rene" };
  if (appName=="") { appName = "deploytest" };

var appOptions = {
  "name": appName,
  "space_guid": spaceID,
  "docker_image" : imageName,
  "organization_guid" : orgID,
  "instances" : 1,
  "requested_state": "started"
}

  CloudController.getInfo().then( (result) => {
    UsersUAA.setEndPoint(result.authorization_endpoint);
    return UsersUAA.login(username, password);
  }).then( (result) => {
    Apps.setToken(result);
    //Apps.remove(appID);
    Apps.add(appOptions);
    //Apps.remove(appID);
    res.send("App Added: "+ appName);
    return "App Added: "+ appName;
  }).then( (result) => {
    console.log(result);
  }).catch( (reason) => {
    console.error("Error: " + reason);
    res.send ("Error: " + reason)
    return
  });
  
});

router.get('/remove', function(req, res, next) {

  CloudController.getInfo().then( (result) => {
    UsersUAA.setEndPoint(result.authorization_endpoint);
    return UsersUAA.login(username, password);
  }).then( (result) => {
    Apps.setToken(result);
    Apps.remove(appID);
    res.send("App Removed");
    return "App Removed";
  }).then( (result) => {
    console.log(result);
  }).catch( (reason) => {
    console.error("Error: " + reason);
    res.send ("Error: " + reason)
    return
  });
  
});

router.get('/start', function(req, res, next) {

  CloudController.getInfo().then( (result) => {
    UsersUAA.setEndPoint(result.authorization_endpoint);
    return UsersUAA.login(username, password);
  }).then( (result) => {
    Apps.setToken(result);
    Apps.start(appID);
    //Apps.remove(appID);
    res.send("App Started");
    return "App Started";
  }).then( (result) => {
    console.log(result);
  }).catch( (reason) => {
    console.error("Error: " + reason);
    res.send ("Error: " + reason)
    return
  });
  
});

router.get('/start', function(req, res, next) {
  
    CloudController.getInfo().then( (result) => {
      UsersUAA.setEndPoint(result.authorization_endpoint);
      return UsersUAA.login(username, password);
    }).then( (result) => {
      Apps.setToken(result);
      Apps.stop(appID);
      //Apps.remove(appID);
      res.send("App Stopped");
      return "App Stopped";
    }).then( (result) => {
      console.log(result);
    }).catch( (reason) => {
      console.error("Error: " + reason);
      res.send ("Error: " + reason)
      return
    });
    
  });

module.exports = router;



 
