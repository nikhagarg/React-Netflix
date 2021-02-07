import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAoIUMQkIhced58A-uVWVFVuX25wXtdrQo",
    authDomain: "niks-netflix-clone.firebaseapp.com",
    projectId: "niks-netflix-clone",
    storageBucket: "niks-netflix-clone.appspot.com",
    messagingSenderId: "299199290869",
    appId: "1:299199290869:web:6bc5050b976ced2eff94bc",
    measurementId: "G-8E6LTQ43RH"
})

const db = firebaseApp.firestore();
export default db;