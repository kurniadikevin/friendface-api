const firebase = require('firebase/app')
// Importing our configuration to initialize our app
const config = require('./config');
// Creates and initializes a Firebase app instance. Pass options as param
const db = firebase.initializeApp(config.firebaseConfig);


/* import { initializeApp } from "firebase/app";
const config = require('./config');

const db = initializeApp(config);
 */
module.exports = db;