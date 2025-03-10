import { Text, View, ActivityIndicator, StyleSheet, Image } from "react-native";
import React, { act, useEffect } from "react";
import { useRouter, Link } from "expo-router";
import { indexStyles } from "./style"; // Import styles from style.js

const App = () => {
  const router = useRouter();

  useEffect(() => {  
    setTimeout(() => {
      router.replace('/home'); // Redirects to the Home screen after 6 seconds
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