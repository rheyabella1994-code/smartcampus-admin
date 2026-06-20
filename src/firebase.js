import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOTKQoELUGiF_h5soErPWogAq5bDJl2sI",
  authDomain: "smartcampusportal-4a2f4.firebaseapp.com",
  projectId: "smartcampusportal-4a2f4",
  storageBucket: "smartcampusportal-4a2f4.firebasestorage.app",
  messagingSenderId: "11174144873",
  appId: "G-KQHK4537GD",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);