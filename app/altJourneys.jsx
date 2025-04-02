import { View, Text, Dimensions, ScrollView, Image } from "react-native";
import { commonStyles, commutesStyles } from "./style";
import BottomSheet from "../components/BottomSheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import Commute from "./utils/commute";
import { getDateYYYYMMDD } from "./utils/helperFunctions";
import { useState } from "react";
import JourneyButton  from "../components/journeyButton";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function AltJourneys() {
  const router = useRouter();
  const params = useLocalSearchParams();
  let loading = false;
  const [journeys, setJourneys] = useState([]);
    useEffect(() => {
    const fetchAltJourneys = async () => {
      loading = true;
      const altJourneys = await Commute.getUniqueJourneys(params.originLatLong, params.destinationLatLong, params.arrivalTime, getDateYYYYMMDD(new Date()));
      loading = false;
      setJourneys(altJourneys);
    };
    fetchAltJourneys();
  }, []);


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
                    loading ? (
                      <ActivityIndicator size={50} color="#DC9F85" />
                    ) : (
                    <Text style={{ textAlign: 'center', color: 'white' }}>No alternate journeys found.</Text>
                    )
                )}
            </ScrollView>
      </BottomSheet>
    </View>
  );
}
