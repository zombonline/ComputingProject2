import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  initializeAuth,
} from "firebase/auth";
//@ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";
import * as Notifications from "expo-notifications";

// 🔥 Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTN0rpcSv7jgvomPM3JQSC_zI_QybXPw0",
  authDomain: "commuty-b6ded.firebaseapp.com",
  projectId: "commuty-b6ded",
  storageBucket: "commuty-b6ded.appspot.com", // ✅ Fixed URL
  messagingSenderId: "414135262177",
  appId: "1:414135262177:web:bad75cd0c41412a49590a0",
  measurementId: "G-RQ5KLS1B5Y",
};

// 🚀 Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Use AsyncStorage for persistent auth state
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), // ✅ Corrected
});

// 🔥 Firestore
const db = getFirestore(app);

// ✅ Sign in anonymously if needed
const signInAnonymouslyIfNeeded = async () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        try {
          const userCredential = await signInAnonymously(auth);
          resolve(userCredential.user);
        } catch (error) {
          reject(error);
        }
      } else {
        resolve(user);
      }
    });
  });
};

// 🔥 Export everything needed
export {
  auth,
  db,
  signInAnonymouslyIfNeeded,
  signOut,
  doc,
  setDoc,
  getDoc,
  signInWithEmailAndPassword
};
