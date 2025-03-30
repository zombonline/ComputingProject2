import { View, ActivityIndicator, Image } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router"; // ✅ Make sure this is at the top level
import { indexStyles } from "./style";
import NotificationHandler from "./utils/notifManager";
import * as Notifications from "expo-notifications";
import { messaging } from "./utils/firebaseConfig";
import { getToken, onMessage } from "firebase/messaging";

const App = () => {
  const router = useRouter(); // ✅ Ensure this is at the top level

  
  useEffect(() => {
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Notification permissions not granted!");
      }
    };

    requestNotificationPermission();

    const timeout = setTimeout(() => {
      router.replace("/home");
    }, 1000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <View style={indexStyles.container}>
      <NotificationHandler />
      <Image source={require("@/assets/images/logo.png")} style={indexStyles.logoImage} />
      <ActivityIndicator size={50} color="#DC9F85" style={indexStyles.activityIndicator} />
    </View>
  );
};

export default App;
