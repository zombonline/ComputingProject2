const functions = require("firebase-functions");

exports.scheduledFunction = functions.https.onRequest((req, res) => {
  console.log("Scheduled function executed.");
  res.send("Function triggered successfully.");
});
