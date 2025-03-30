import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

const NotifManager = () => {
    const router = useRouter(); // ✅ Use expo-router's navigation system

    console.log("NotifManager mounted");

    useEffect(() => {
        // Listener for when a notification is interacted with while the app is running
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const screen = response.notification.request.content.data?.screen;
                const params = response.notification.request.content.data?.params || {}; 
                if (screen) {
                  router.push({
                      pathname: screen,
                      params: params
                  });
              }
        });

        // Handle notifications when the app is opened from a killed state
        (async () => {
            const response = await Notifications.getLastNotificationResponseAsync();
            if (response) {
                const screen = response.notification.request.content.data?.screen;
                const params = response.notification.request.content.data?.params || {}; 
                if (screen) {
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

    return null; 
};

export default NotifManager;