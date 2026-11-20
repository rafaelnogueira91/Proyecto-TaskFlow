
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth';

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

// En web Firebase utiliza su persistencia habitual; en nativo usa AsyncStorage.
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    // Fast Refresh puede haber inicializado Auth previamente.
    if (error.code === 'auth/already-initialized') {
      auth = getAuth(app);
    } else {
      throw error;
    }
  }
}
const db = getFirestore(app);

export { auth, db };
