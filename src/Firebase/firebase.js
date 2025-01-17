// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB9qIuQhJM9T9b6qcnaLTUTRU5kAuuG2nw",
    authDomain: "hackathone-34448.firebaseapp.com",
    projectId: "hackathone-34448",
    storageBucket: "hackathone-34448.appspot.com",
    messagingSenderId: "1087616256564",
    appId: "1:1087616256564:web:23b45d34ca28178df55861"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
import { doc, getDoc, getFirestore } from "firebase/firestore";



const db = getFirestore(app);

export {
    app,
    auth, doc,
    getDoc,
    db,
    getStorage, ref, uploadBytesResumable, getDownloadURL

}