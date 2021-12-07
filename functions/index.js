const functions = require("firebase-functions");
var fetch = require("node-fetch");

const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.sendPushNotification = functions.firestore
  .document("users/{pushToken")
  .onWrite(async (event) => {
      let docId = event.after.id
      let name = event.after.get('name')
      let age = event.after.get('age')
      var message = {
          notification: {
              title: name,
              age: age
          },
          topic: 'rozin hasan'
      }
      let response = await admin.messaging().send(message)
      console.warn(response)
      
  });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
