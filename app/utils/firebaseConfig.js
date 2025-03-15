// utils/firebaseConfig.js

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword  // 👈 Agregar esta función
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  initializeFirestore,
  memoryLocalCache
} from "firebase/firestore";

// 🔥 Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTN0rpcSv7jgvomPM3JQSC_zI_QybXPw0",
  authDomain: "commuty-b6ded.firebaseapp.com",
  projectId: "commuty-b6ded",
  storageBucket: "commuty-b6ded.firebasestorage.app",
  messagingSenderId: "414135262177",
  appId: "1:414135262177:web:bad75cd0c41412a49590a0",
  measurementId: "G-RQ5KLS1B5Y",
};

// 🚀 Inicializar Firebase
const app = initializeApp(firebaseConfig);

// 🔒 Inicializar Firebase Auth (sin `initializeAuth()`)
const auth = getAuth(app);

// 🗃 Inicializar Firestore con caché en memoria
const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
});

// ✅ Iniciar sesión anónima solo si es necesario
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

// 🔥 Exportar todo lo necesario
export { auth, db, signInAnonymouslyIfNeeded, signOut, doc, setDoc, getDoc, signInWithEmailAndPassword };  // 👈 Exportar aquí
