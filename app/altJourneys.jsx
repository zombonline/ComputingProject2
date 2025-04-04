/**
 * Import necessary libraries and components.
 */
import { View, Text, Dimensions, ScrollView, Image } from "react-native";
import { textStyles } from "./style";
import BottomSheet from "../components/BottomSheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import Commute from "./utils/commute";
import { getDateYYYYMMDD } from "./utils/helperFunctions";
import { useState } from "react";
import JourneyButton from "../components/journeyButton";
/**
 * AltJourneys component to display alternate journeys.
 * It fetches alternate journeys based on origin, destination, and arrival time.
 */
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/**
 * Fetches alternate journeys based on the provided parameters.
 * It uses the Commute utility to get unique journeys.
 * The fetched journeys are displayed in a scrollable view.
 */
export default function AltJourneys() {
  const router = useRouter();
  const params = useLocalSearchParams();
  let loading = false;
  const [journeys, setJourneys] = useState([]);
  useEffect(() => {
    const fetchAltJourneys = async () => {
      loading = true;
      const altJourneys = await Commute.getUniqueJourneys(
        params.originLatLong,
        params.destinationLatLong,
        params.arrivalTime,
        getDateYYYYMMDD(new Date())
      );
      loading = false;
      setJourneys(altJourneys);
    };
    fetchAltJourneys();
  }, []);


  /**
   * Render the AltJourneys component.
   * It displays a bottom sheet with alternate journeys.
   */
  return (
    <View>
      <BottomSheet
        halfHeight={SCREEN_HEIGHT * 0.5}
        onDismiss={() => router.replace("/home")}
      >
        <Text style={textStyles.panelTitle}>Alternate Journeys</Text>
        <Text style={{ fontSize: 10, textAlign: "center", color: "white" }}>
          {" "}
          Here are some alternate methods for your commute from {
            params.origin
          }{" "}
          to {params.destination}
        </Text>
        <ScrollView>
          {journeys.length > 0 ? (
            journeys.map((journey, index) => (
              <JourneyButton key={index} journey={journey} />
            ))
          ) : loading ? (
            <ActivityIndicator size={50} color="#DC9F85" />
          ) : (
            <Text style={{ textAlign: "center", color: "white" }}>
              No alternate journeys found.
            </Text>
          )}
        </ScrollView>
      </BottomSheet>
    </View>
  );
}
