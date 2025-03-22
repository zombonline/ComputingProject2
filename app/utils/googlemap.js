// googlemap.js
import React from "react";
import { View, StyleSheet } from "react-native"; 
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

export default function GoogleMap({ style }) {
  return (
    <View style={[styles.container, style]}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex:0,
  },
});