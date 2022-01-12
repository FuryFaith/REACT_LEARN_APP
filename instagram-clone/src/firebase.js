import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD9cKb48dfD-il5R5tBAP55yGfxk0Cue6Y",
    authDomain: "instagram-clone-react-17ebd.firebaseapp.com",
    projectId: "instagram-clone-react-17ebd",
    storageBucket: "instagram-clone-react-17ebd.appspot.com",
    messagingSenderId: "1059707745195",
    appId: "1:1059707745195:web:1f84bd8c4dfd81382598ee",
    measurementId: "G-1VFMVX17X6"
  };  

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };