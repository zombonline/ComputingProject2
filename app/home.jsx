import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { signInAnonymouslyIfNeeded, db, doc, setDoc, getDoc } from "@/app/utils/firebaseConfig";
import { saveUserDataLocally, getLocalUserData } from "@/app/utils/accountStorage";
import  GoogleMap from "./utils/googlemap";

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const user = await signInAnonymouslyIfNeeded();
        setUserId(user.uid);

        // 🗃 Verificar si el usuario ya existe en Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        let userData;

        if (!userSnap.exists()) {
          // 🔥 Crear perfil por defecto si no existe
          userData = { uid: user.uid, preferences: {} };
          await setDoc(userRef, userData);
        } else {
          userData = userSnap.data();
        }

        // 💾 Guardar datos del usuario localmente (sin contraseña)
        await saveUserDataLocally(userData);

        setLoading(false);
      } catch (error) {
        console.error("Error initializing user:", error);
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  if (loading) {
    return (
      <>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Initializing user...</Text>
      </>
    );
  }

  return (
    <>
      <Text>Welcome, anonymous user!</Text>
      <Text>Your ID: {userId}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
});

export default HomeScreen;
