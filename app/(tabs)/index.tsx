import { Image, StyleSheet, Platform, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MapView, { PROVIDER_DEFAULT, UrlTile } from 'react-native-maps';
import { View, Text, Dimensions } from 'react-native';



export default function HomeScreen() {

  const { width, height } = Dimensions.get('window');

  return (
    <View>
    
      
      <MapView
        provider={PROVIDER_DEFAULT}
        style={{ height: height, width: width }}
        initialRegion={{
          latitude: 51.506758,
          longitude: 0.073814,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        customMapStyle={[
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#308099' }],
          },
          {
            elementType: 'labels.text.fill',
            stylers: [{ color: '#990099' }],
          }          
        ]}
      >
        <UrlTile
          urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />
      </MapView>
      


    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
