import { View, Text, Dimensions, ScrollView, Image } from "react-native";
import { commonStyles, commutesStyles } from "./style";
import BottomSheet from "../components/BottomSheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import Commute from "./utils/commute";
import { getDateYYYYMMDD } from "./utils/helperFunctions";
import { useState } from "react";
import { commuteTestStyles } from "./style";


const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const modeImages = {
    bus: require('../assets/images/mode_bus.png'),
    overground: require('../assets/images/mode_overground.png'),
    tube: require('../assets/images/mode_tube.png'),
  };
  

export default function AltJourneys() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [journeys, setJourneys] = useState([]);
    useEffect(() => {
    const fetchAltJourneys = async () => {
      const altJourneys = await Commute.getUniqueJourneys(params.originLatLong, params.destinationLatLong, params.arrivalTime, getDateYYYYMMDD(new Date()));
      setJourneys(altJourneys);
    };
    fetchAltJourneys();
  }, []);

  function JourneyButton({journey}) {
    return (
      <View style={{...commuteTestStyles.journeyButton, alignItems: 'center'}}>
        <View style={{width:"90%", justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap'}}>
        {journey.legs.map((leg) => {
            if(leg.mode.id == "walking"){ return null; }
            const imageSource = modeImages[leg.mode.id]; // Get the image source from the mapping
            return (
                <View style={{width:"30%", justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                <Text style={{fontSize: 8, textAlign: 'center', color: 'white', paddingHorizontal:10}}>{leg.departurePoint.commonName}</Text>
                <Image source={imageSource} style={{width: "10", aspectRatio: 1}} resizeMode="contain"  />
                </View>
            );
        })}
        <Text style={{fontSize: 8, textAlign: 'center', color: 'white', paddingHorizontal:10}}>{params.destination}</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={commonStyles.container}>
      <BottomSheet
        halfHeight={SCREEN_HEIGHT * 0.5}
        onDismiss={() => router.replace("/home")}
      >
        <Text style={commutesStyles.panelTitle}>Alternate Journeys</Text>
        <Text style={{ fontSize: 10, textAlign: 'center', color: 'white' }}> Here are some alternate methods for your commute from {params.origin} to {params.destination}</Text>
            <ScrollView>
                {journeys.length > 0 ? (
                    journeys.map((journey, index) => (
                        <JourneyButton key={index} journey={journey} />
                    ))
                ) : (
                    <Text style={{ textAlign: 'center', color: 'white' }}>No alternate journeys found.</Text>
                )}
            </ScrollView>
      </BottomSheet>
    </View>
  );
}
