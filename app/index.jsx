import { Text, View, ActivityIndicator, StyleSheet, Image } from "react-native";
import React, { act, useEffect } from "react";
import { useRouter, Link } from "expo-router";
import { indexStyles } from "./style";
import { requestPermissions, scheduleNotification, setupNotificationChannel, checkScheduledNotifications } from './utils/notifManager';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const App = () => {
  const router = useRouter();

  useEffect(() => {
      Notifications.presentNotificationAsync({
        title: "Notifcation Test",
        body: "HELLO!!!!!!",
      });
    requestPermissions();
    setupNotificationChannel();
    scheduleNotification();
    setTimeout(() => {
      router.replace('/home');
    }, 1000);
  }, []);

  return (
    <View style={indexStyles.container}>
      <Image 
        source={require('@/assets/images/logo.png')}  
        style={indexStyles.logoImage} 
      />
      <ActivityIndicator size={50} color="#DC9F85" style={indexStyles.activityIndicator} />
    </View>
  );
}

export default App;