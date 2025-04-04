/**
 * Import necessary libraries and components.
 */
import React, { useEffect, useState } from "react";
import { Text, ActivityIndicator, View } from "react-native";
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
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const user = await signInAnonymouslyIfNeeded();
        setUserId(user.uid);
        
        // Get user document reference from Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        let userData;

        if (!userSnap.exists()) {

          await setDoc(userRef, userData);
        } else {
          userData = userSnap.data();
          setUsername(userData.username || "Anonymous");
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Initializing user...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome, {username} user!</Text>
      <Text>Your ID: {userId}</Text>
    </View>
  );
};

export default HomeScreen;
