
function workflowlist(req, res, next) {
  res.send("1) Buildprocess");
}

function event(req, res, next) {
  let action = req.params.action;
  console.log ("Heard event " + action);
  res.send("Heard event " + action);
}

module.exports = {
  workflowlist,
  event
};