import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";

const mapRef = React.createRef(null);

let moveToLocation = () => {};
let setMarker = () => {};
let clearMarkers = () => {};
let fitMarkers = () => {};

export default function GoogleMap({ style }) {
  const [marker1, setMarker1] = useState(null);
  const [marker2, setMarker2] = useState(null);

  moveToLocation = (latlong) => {
    const [latitude, longitude] = latlong.split(",").map(Number);
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      1000
    );
  };
  setMarker = (markerNumber, latlong) => {
    const [latitude, longitude] = latlong.split(",").map(Number);

    if (markerNumber === 1) {
      setMarker1({ latitude, longitude });
    } else if (markerNumber === 2) {
      setMarker2({ latitude, longitude });
    }
  };
  clearMarkers = () => {
    setMarker1(null);
    setMarker2(null);
  };
  fitMarkers = () => {
    console.log("Fitting to:", marker1, marker2);
    mapRef.current?.fitToCoordinates([marker1, marker2], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });
  };

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        region={{
          latitude: 51.58825,
          longitude: -0.1,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        showsTransit={true}
      >
        {marker1 && <Marker coordinate={marker1} pinColor="red" />}
        {marker2 && <Marker coordinate={marker2} pinColor="blue" />}
        {marker1 && marker2 && (
          <Polyline
            coordinates={[marker1, marker2]}
            strokeWidth={4}
            strokeColor="blue"
          />
        )}
      </MapView>
    </View>
  );
}

export { moveToLocation, setMarker, clearMarkers, fitMarkers };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 0,
  },
});
