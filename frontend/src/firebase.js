// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "skyline-estate.firebaseapp.com",
  projectId: "skyline-estate",
  storageBucket: "skyline-estate.appspot.com",
  messagingSenderId: "913848670102",
  appId: "1:913848670102:web:bbc4b087a1e9dfd950afb7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);