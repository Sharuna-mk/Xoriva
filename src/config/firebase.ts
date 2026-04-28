// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA0HvkHxfqi3Aw6ahVebwPFHC_2Me4lcdA",
  authDomain: "xoriva-fe966.firebaseapp.com",
  projectId: "xoriva-fe966",
  storageBucket: "xoriva-fe966.firebasestorage.app",
  messagingSenderId: "1048917910387",
  appId: "1:1048917910387:web:7579aa9055459926561b06",
  measurementId: "G-87VVDK3K5Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const authentication = getAuth(app);