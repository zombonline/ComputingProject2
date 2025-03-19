import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 🚀 Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ✅ Request permissions
export async function requestPermissions() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== 'granted') {
      console.warn("🚨 Notification permissions not granted!");
    }
    return newStatus;
  }
  return status;
}

// 🔔 Setup notification channel (for Android)
export async function setupNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default Channel',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}

// 📅 Schedule notifications
export async function scheduleNotification() {
  console.log("⏳ Scheduling notification...");

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test",
        body: "This should appear in 10 seconds!",
      },
      trigger: { seconds: 10 },
    });
    console.log("✅ First notification scheduled");

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder!",
        body: "This is your recurring notification.",
      },
      trigger: {
        hour: 23,
        minute: 25,
        repeats: true,
      },
    });
    console.log("✅ Recurring notification scheduled");
  } catch (error) {
    console.error("❌ Error scheduling notification:", error);
  }
}

// 🔍 Check scheduled notifications
export async function checkScheduledNotifications() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  console.log('📋 Scheduled Notifications:', scheduled);
}

// 📩 Listen for incoming notifications
export function setupNotificationListeners() {
  const receivedListener = Notifications.addNotificationReceivedListener(notification => {
    console.log("📥 Notification received:", notification);
  });

  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log("📲 User interacted with notification:", response);
  });

  // ✅ Return unsubscribe functions to be used in cleanup
  return () => {
    receivedListener.remove();
    responseListener.remove();
  };
}
