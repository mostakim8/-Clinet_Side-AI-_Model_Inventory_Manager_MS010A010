import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore"; // <-- ADD THIS
// Your web app's Firebase 
import { getStorage } from "firebase/storage";
// configuration (PASTE YOUR KEYS HERE)
const firebaseConfig = {
    apiKey: "AIzaSyAuvfi_jgn3vYCZrDgIFfhim-G0J_xEm4Q",
  authDomain: "ai-model-inventory-manag-390aa.firebaseapp.com",
  projectId: "ai-model-inventory-manag-390aa",
  storageBucket: "ai-model-inventory-manag-390aa.firebasestorage.app",
  messagingSenderId: "768557931805",
  appId: "1:768557931805:web:5dc639ce895ee1df1c15f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // <-- INITIALIZE FIRESTORE HERE
const storage = getStorage(app);
export  {auth,db,app,storage}; // Export the auth object for use in components

export default auth;