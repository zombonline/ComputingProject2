import { initializeApp } from "firebase/app";
import {
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  initializeAuth,
} from "firebase/auth";
import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTN0rpcSv7jgvomPM3JQSC_zI_QybXPw0",
  authDomain: "commuty-b6ded.firebaseapp.com",
  projectId: "commuty-b6ded",
  storageBucket: "commuty-b6ded.appspot.com",
  messagingSenderId: "414135262177",
  appId: "1:414135262177:web:bad75cd0c41412a49590a0",
  measurementId: "G-RQ5KLS1B5Y",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), 
});

const db = getFirestore(app);

/**
 * Signs in a user anonymously if they are not already signed in.
 * @returns {Promise<User>} - A promise that resolves to the user object.
 */
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

export {
  auth,
  db,
  signInAnonymouslyIfNeeded,
  signOut,
  doc,
  setDoc,
  getDoc,
  signInWithEmailAndPassword,
};
