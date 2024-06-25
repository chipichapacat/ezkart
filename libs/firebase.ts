// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBr-PV42Wf11OR5ycuyGcfWLPiAIE9r5F0",
  authDomain: "ezkart-b98c1.firebaseapp.com",
  projectId: "ezkart-b98c1",
  storageBucket: "ezkart-b98c1.appspot.com",
  messagingSenderId: "232051460849",
  appId: "1:232051460849:web:5cdfbf2d19abc30e727750"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;