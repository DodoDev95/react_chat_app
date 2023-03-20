import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "process.env.REACT_APP_API_KEY",
  authDomain: "process.env.REACT_APP_AUTHDOMAIN",
  projectId: "process.env.REACT_APP_PROJECTID",
  storageBucket: "process.env.REACT_APP_STORAGE_BUCKET",
  messagingSenderId: "process.env.REACT_APP_MESSAGING_SENDER_ID",
  appId: "process.env.REACT_APP_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const dataBase = getFirestore(app);
