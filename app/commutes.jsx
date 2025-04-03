import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { standardButtonStyle, textStyles } from "./style";
import BottomSheet from "../components/BottomSheet";
import { getCommutes, getCommutesFromFirestore } from "./utils/accountStorage";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
export default function Commutes() {
  const router = useRouter();
  const [commutes, setCommutes] = useState({});

  useEffect(() => {
    const loadCommutes = async () => {
      const storedCommutes = await getCommutes();
      const firebaseCommutes = await getCommutesFromFirestore();
      const allCommutes = { ...storedCommutes, ...firebaseCommutes };
      setCommutes(allCommutes);
    };
    loadCommutes();
  }, []);

  return (
    <View>
      <BottomSheet
        halfHeight={SCREEN_HEIGHT * 0.5}
        onDismiss={() => router.replace("/home")}
        onModeChange={(newMode) => {
          console.log("Commutes mode updated to:", newMode);
        }}
      >
        <Text style={textStyles.panelTitle}>Your Commutes</Text>
        <ScrollView>
          {Object.keys(commutes).length > 0 ? (
            Object.values(commutes).map((commute, index) => (
              <TouchableOpacity
                key={index}
                style={standardButtonStyle}
                onPress={() =>
                  router.push({
                    pathname: "/commuteEdit",
                    params: {
                      name: commute.name,
                      origin: commute.origin,
                      originLatLong: commute.originLatLong,
                      destination: commute.destination,
                      destinationLatLong: commute.destinationLatLong,
                      arrivalTime: commute.arrivalTime,
                      days: JSON.stringify(commute.days), // Convert array to string
                      journeyId: commute.journeyId,
                      commuteId: commute.commuteId,
                      duration: commute.duration,
                    },
                  })
                }
              >
                <FontAwesome
                  name="pencil"
                  size={20}
                  color="black"
                  style={standardButtonStyle.icon}
                />
                <Text style={textStyles.blackStandardStyle}>
                  {commute.name}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={textStyles.whiteStandardStyle}>
              No saved commutes found.
            </Text>
          )}
        </ScrollView>

        <TouchableOpacity
          style={standardButtonStyle}
          onPress={() => router.push("/commuteEdit")}
        >
          <Ionicons
            name="add-outline"
            size={24}
            color="black"
            style={standardButtonStyle.icon}
          />
          <Text style={textStyles.blackStandardStyle}>Add</Text>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  );
}
