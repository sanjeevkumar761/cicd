var cfNodejsClient = require("cf-nodejs-client");

//get environment variables
const endpoint = process.env.CICD_ENDPOINT;
const un = process.env.CICD_UN;
const pw = process.env.CICD_PW;
const spaceid = process.env.CICD_SPACEID;
const orgid = process.env.CICD_ORGID;

//Setup clpud objects
const CloudController = new (require("cf-nodejs-client")).CloudController(endpoint);
const UsersUAA = new (require("cf-nodejs-client")).UsersUAA;
const CloudApps = new (require("cf-nodejs-client")).Apps(endpoint);


function appremove(appid) {

  console.log("removing " + appid);

  if (!appid) {
    return "No App Specified";
  }

  CloudController.getInfo().then((result) => {
    UsersUAA.setEndPoint(result.authorization_endpoint);
    return UsersUAA.login(un, pw);
  }).then((result) => {
    CloudApps.setToken(result);
    CloudApps.remove(appid);
    return "App Removed";
  }).then((result) => {
    console.log(result);
  }).catch((reason) => {
    console.error("Error: " + reason);
  });
}

function workflowlist(req, res, next) {
  res.send("1) Buildprocess");
}

function event(req, res, next) {
  let action = req.params.action;
  console.log ("Heard event " + action);
  console.log ("with payload:");
  console.log (req.body);

if (action == "buildcomplete") {
  // let appid;
  console.log ("recognised buildcomplete evenet and started preparing for deployment...")
  // appremove (appid);
}
  

  res.send("Processed " + action );
}


/* CALLBACK FROM DOCKER BUILD
{
  "callback_url": "https://registry.hub.docker.com/u/svendowideit/testhook/hook/2141b5bi5i5b02bec211i4eeih0242eg11000a/",
  "push_data": {
    "images": [
        "27d47432a69bca5f2700e4dff7de0388ed65f9d3fb1ec645e2bc24c223dc1cc3",
        "51a9c7c1f8bb2fa19bcd09789a34e63f35abb80044bc10196e304f6634cc582c",
        "..."
    ],
    "pushed_at": 1.417566161e+09,
    "pusher": "trustedbuilder",
    "tag": "latest"
  },
  "repository": {
    "comment_count": "0",
    "date_created": 1.417494799e+09,
    "description": "",
    "dockerfile": "#\n# BUILD\u0009\u0009docker build -t svendowideit/apt-cacher .\n# RUN\u0009\u0009docker run -d -p 3142:3142 -name apt-cacher-run apt-cacher\n#\n# and then you can run containers with:\n# \u0009\u0009docker run -t -i -rm -e http_proxy http://192.168.1.2:3142/ debian bash\n#\nFROM\u0009\u0009ubuntu\n\n\nVOLUME\u0009\u0009[\/var/cache/apt-cacher-ng\]\nRUN\u0009\u0009apt-get update ; apt-get install -yq apt-cacher-ng\n\nEXPOSE \u0009\u00093142\nCMD\u0009\u0009chmod 777 /var/cache/apt-cacher-ng ; /etc/init.d/apt-cacher-ng start ; tail -f /var/log/apt-cacher-ng/*\n",
    "full_description": "Docker Hub based automated build from a GitHub repo",
    "is_official": false,
    "is_private": true,
    "is_trusted": true,
    "name": "testhook",
    "namespace": "svendowideit",
    "owner": "svendowideit",
    "repo_name": "svendowideit/testhook",
    "repo_url": "https://registry.hub.docker.com/u/svendowideit/testhook/",
    "star_count": 0,
    "status": "Active"
  }
}
*/

module.exports = {
  workflowlist,
  event
};