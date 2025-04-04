/**
 * Import necessary libraries and components.
 */
import { View, ActivityIndicator, Image } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router"; 
import { backgroundColor, indexStyles } from "./style";
import NotificationHandler from "./utils/notifManager";
import * as Notifications from "expo-notifications";
import { LogBox } from "react-native";

const App = () => {
  const router = useRouter(); 
  LogBox.ignoreAllLogs();
 /**
  * Request notification permissions and navigate to the home screen after a delay. 
  * This effect runs once when the component mounts.
 */
  useEffect(() => {
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Notification permissions not granted!");
      }
    };
    /**
     * Request notification permissions when the app starts.
     */
    requestNotificationPermission();
    /**
     * Set a timeout to navigate to the home screen after 1 second.
     */
    const timeout = setTimeout(() => {
      router.replace("/home");
    }, 1000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <View
      style={{
        ...backgroundColor,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <NotificationHandler />
      <Image
        source={require("@/assets/images/logo.png")}
        style={{
          width: 150,
          height: 150,
          alignSelf: "center",
          resizeMode: "contain",
        }}
      />
      <ActivityIndicator size={50} color="#DC9F85" style={{ marginTop: 20 }} />
    </View>
  );
};

export default App;
