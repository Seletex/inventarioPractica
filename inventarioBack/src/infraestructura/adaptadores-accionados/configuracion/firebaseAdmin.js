
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credentiaol: admin.credential.cert(serviceAccount),
}) 


module.exports = admin;
