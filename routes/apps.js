"use strict";

var express = require('express');
var cfNodejsClient = require("cf-nodejs-client");
var tableify = require('tableify');
var router = express.Router();

const endpoint = "https://api.cf.eu10.hana.ondemand.com";
const username = "sanjeev_kumar@rcomext.com";
const password = "Hackathon8%2";
const spaceid = "79a6cdb5-296b-46bd-b28a-a433492009de";
const orgid = "53f33523-70ab-4c1a-b8ac-bfb233a0d853";
 
const CloudController = new (require("cf-nodejs-client")).CloudController(endpoint);
const UsersUAA = new (require("cf-nodejs-client")).UsersUAA;
const Apps = new (require("cf-nodejs-client")).Apps(endpoint);

router.get('/', function(req, res, next) {

  var format = req.query.format;

  CloudController.getInfo().then( (result) => {
    UsersUAA.setEndPoint(result.authorization_endpoint);
    return UsersUAA.login(username, password);
  }).then( (result) => {
    Apps.setToken(result);
    Apps.getApps().then( (resultApps) => {
      var resp
      if (format=="JSON") {
        resp = resultApps
      } else {
        resp = "<html>";
        resp += '<head><link rel="stylesheet" type="text/css" href="stylesheets/style.css"></head>'
        resp += tableify (resultApps);
        resp += "</html>"
      }
      res.send(resp);
    });
    return "Apps Listed";
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
  "docker_image" : imagename,
  "organization_guid" : orgid,
  "instances" : 1,
  "requested_state": "started"
}

  CloudController.getInfo().then( (result) => {
    UsersUAA.setEndPoint(result.authorization_endpoint);
    return UsersUAA.login(username, password);
  }).then( (result) => {
    console.log( "Adding " + appname + " from " + imagename);
    Apps.setToken(result);
    //Apps.remove(appID);
    Apps.add(appoptions).then( (resultAdd) => {
      res.send(resultAdd);
      return resultAdd;
    }).catch( (reasonAdd) => {
      console.error("Error: " + reasonAdd);
      res.send ("Error: " + reasonAdd)
      return
    })
  }).then( (result) => {
    console.log(result);
  }).catch( (reason) => {
    console.error("Error: " + reason);
    res.send ("Error: " + reason)
    return
  });
  
});

router.get('/remove', function(req, res, next) {

  var appid = req.query.appid;
  if (!appid) {
    res.send("No App Specified");
    return "No App Specified";
  }

  CloudController.getInfo().then( (result) => {
    UsersUAA.setEndPoint(result.authorization_endpoint);
    return UsersUAA.login(username, password);
  }).then( (result) => {
    Apps.setToken(result);
    Apps.remove(appid);
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

  var appid = req.query.appid;
  if (!appid) {
    res.send("No App Specified");
    return "No App Specified";
  }

  CloudController.getInfo().then( (result) => {
    UsersUAA.setEndPoint(result.authorization_endpoint);
    return UsersUAA.login(username, password);
  }).then( (result) => {
    Apps.setToken(result);
    Apps.start(appid);
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

router.get('/stop', function(req, res, next) {

  var appid = req.query.appid;
  if (!appid) {
    res.send("No App Specified");
    return "No App Specified";
  }
  
    CloudController.getInfo().then( (result) => {
      UsersUAA.setEndPoint(result.authorization_endpoint);
      return UsersUAA.login(username, password);
    }).then( (result) => {
      Apps.setToken(result);
      Apps.stop(appid);
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




 
