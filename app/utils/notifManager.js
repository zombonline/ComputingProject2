import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

const NotifManager = () => {
    const router = useRouter(); // ✅ Use expo-router's navigation system

    console.log("NotifManager mounted");

    useEffect(() => {
        console.log("Setting up notification listener");

        // Listener for when a notification is interacted with while the app is running
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("🔔 Notification clicked! Response:", response);
            const screen = response.notification.request.content.data?.screen;
            const params = response.notification.request.content.data?.params || {}; 
            if (screen) {
              console.log("Navigating to:", screen, "with params:", params);
              router.push({
                  pathname: screen,
                  params, // Pass additional data as query parameters
              });
          }
        });

        // Handle notifications when the app is opened from a killed state
        (async () => {
            const response = await Notifications.getLastNotificationResponseAsync();
            if (response) {
                console.log("🔔 App opened via notification! Response:", response);
                const screen = response.notification.request.content.data?.screen;
                const params = response.notification.request.content.data?.params || {}; 
                if (screen) {
                  console.log("Navigating to:", screen, "with params:", params);
                  router.push({
                      pathname: screen,
                      params: params
                  });
              }
            }
        })();

        return () => {
            console.log("Removing notification listener");
            subscription.remove();
        };
    }, []);

    return null; // ✅ This component doesn't render anything
};

export default NotifManager;