// googlemap.js (example)
import React from "react";
import { View, StyleSheet } from "react-native"; // Use "react-native", not "react-native-web"
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
    // By default, let it fill its parent.
    flex: 1,
    zIndex:0,
  },
});
