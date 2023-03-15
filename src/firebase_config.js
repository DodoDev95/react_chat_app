import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAlebU7bJM2P94cjrbQ8mG3yhDUd3A-50k",
  authDomain: "react-chat-app-5e90f.firebaseapp.com",
  projectId: "react-chat-app-5e90f",
  storageBucket: "react-chat-app-5e90f.appspot.com",
  messagingSenderId: "595590358738",
  appId: "1:595590358738:web:7a4ebb97067e9dff20ef0b",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const dataBase = getFirestore(app);
