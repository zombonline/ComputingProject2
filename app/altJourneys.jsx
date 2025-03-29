import { View, Text, Dimensions } from "react-native";
import { commonStyles, commutesStyles } from "./style";
import BottomSheet from "../components/BottomSheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function AltJourneys() {
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log(params)
  useEffect(() => {

  }, [params]);

  return (
    <View style={commonStyles.container}>
      <BottomSheet
        halfHeight={SCREEN_HEIGHT * 0.5}
        onDismiss={() => router.replace("/home")}
      >
        <Text style={commutesStyles.panelTitle}>Alternate Journeys</Text>
        <Text> {JSON.stringify(params)} </Text>
      </BottomSheet>
    </View>
  );
}