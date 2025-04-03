import React, { useEffect, useState } from "react";
import { Text, ActivityIndicator } from "react-native";
import {
  signInAnonymouslyIfNeeded,
  db,
  doc,
  setDoc,
  getDoc,
} from "@/app/utils/firebaseConfig";
import { saveUserDataLocally } from "@/app/utils/accountStorage";

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const user = await signInAnonymouslyIfNeeded();
        setUserId(user.uid);

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        let userData;

        if (!userSnap.exists()) {
          userData = { uid: user.uid, preferences: {} };
          await setDoc(userRef, userData);
        } else {
          userData = userSnap.data();
        }

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

export default HomeScreen;
