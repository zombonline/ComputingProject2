import { View, ActivityIndicator, Image } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router"; // ✅ Make sure this is at the top level
import { indexStyles } from "./style";
import { requestPermissions, scheduleNotification, setupNotificationChannel } from "./utils/notifManager";
import * as Notifications from "expo-notifications";
import { messaging } from "./utils/firebaseConfig";
import { getToken, onMessage } from "firebase/messaging";

const App = () => {
  const router = useRouter(); // ✅ Ensure this is at the top level

  useEffect(() => {
    const setupNotifications = async () => {
      await requestPermissions();
      await setupNotificationChannel();

      if (messaging) {
        try {
          const token = await getToken(messaging);
          console.log("FCM Token:", token);
        } catch (err) {
          console.log("Error getting FCM token:", err);
        }

        const unsubscribe = onMessage(messaging, (message) => {
          console.log("New FCM message:", message);
          Notifications.scheduleNotificationAsync({
            content: {
              title: message.notification?.title || "New Notification",
              body: message.notification?.body || "You have a new message.",
            },
            trigger: null,
          });
        });

        return () => unsubscribe();
      }
    };

    setupNotifications();
  }, []); // ✅ No hooks inside `useEffect`

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/home");
    }, 1000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <View style={indexStyles.container}>
      <Image source={require("@/assets/images/logo.png")} style={indexStyles.logoImage} />
      <ActivityIndicator size={50} color="#DC9F85" style={indexStyles.activityIndicator} />
    </View>
  );
};

export default App;
