import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function requestPermissions() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
}
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
export async function scheduleNotification() {
    console.log("Scheduling notification");

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
export async function checkScheduledNotifications() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  console.log('Scheduled Notifications:', scheduled);
}