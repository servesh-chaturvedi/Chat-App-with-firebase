import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyC9UV4LGpJUmskdQRI95Ed5c2ThqAm7ndc",
    authDomain: "whatsap-copy.firebaseapp.com",
    projectId: "whatsap-copy",
    storageBucket: "whatsap-copy.appspot.com",
    messagingSenderId: "427269761567",
    appId: "1:427269761567:web:2e5a333e62c42b1957032a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore()
const auth = getAuth()
const provider = new GoogleAuthProvider();

export { db, auth, provider }
