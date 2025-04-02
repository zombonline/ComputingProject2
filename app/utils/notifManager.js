import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

const NotifManager = () => {
  const router = useRouter();

  const handleNotificationResponse = (response) => {
    const screen = response.notification.request.content.data?.screen;
    const params = response.notification.request.content.data?.params || {};
    if (screen) {
      router.push({ pathname: screen, params });
    }
  };

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    const checkLastNotification = async () => {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (response) handleNotificationResponse(response);
    };

    checkLastNotification();

    return () => subscription.remove();
  }, []);

  return null;
};

export default NotifManager;
