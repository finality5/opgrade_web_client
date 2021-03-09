import firebase from "firebase/app";

require("firebase/auth");
require("firebase/database");


const firebaseConfig = {
    apiKey: "AIzaSyAfG1NOIhN7LdB6o-3rz9YmRN-mhPnt_qk",
    authDomain: "opgrade.firebaseapp.com",
    databaseURL: "https://opgrade-default-rtdb.firebaseio.com",
    projectId: "opgrade",
    storageBucket: "opgrade.appspot.com",
    messagingSenderId: "314201452178",
    appId: "1:314201452178:web:2eba8e89859f5d2dde004b",
    measurementId: "G-5JRDYRQ33B"
  };

  
const Firebase=firebase.initializeApp(firebaseConfig);
  

  export default Firebase
