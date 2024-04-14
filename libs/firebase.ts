// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCfzG9VCBOUfc0guwNQjVfZ3rry9qNX6Y",
  authDomain: "gt-shop-eecbb.firebaseapp.com",
  projectId: "gt-shop-eecbb",
  storageBucket: "gt-shop-eecbb.appspot.com",
  messagingSenderId: "306735007056",
  appId: "1:306735007056:web:5c22adfb67a4150d0b5855"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;