import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAsmdCIyVow2DEeKGfXJcyH8F3H5vsdgmw",
  authDomain: "mycode-challenge.firebaseapp.com",
  projectId: "mycode-challenge",
  storageBucket: "mycode-challenge.appspot.com",
  messagingSenderId: "982883470532",
  appId: "1:982883470532:web:c38042a070a2cfb83f0d91",
  measurementId: "G-0GSED5YVQN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };