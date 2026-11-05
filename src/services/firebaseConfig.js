
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxMJpTHrN8QQBUiSE8Dd2T8xzavsJLrhs",
  authDomain: "taskflow-a6ffa.firebaseapp.com",
  projectId: "taskflow-a6ffa",
  storageBucket: "taskflow-a6ffa.firebasestorage.app",
  messagingSenderId: "495768676364",
  appId: "1:495768676364:web:82732045a06ffa9ab3e629",
  measurementId: "G-GPEP4WTRBB",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
