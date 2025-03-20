import React, {useState, useEffect} from "react";
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Feather";
import { commonStyles, commutesStyles } from "./style";
import BottomSheet from "../components/BottomSheet";
import { getCommutes } from "./utils/accountStorage";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Commutes() {
  const router = useRouter();
  const [commutes, setCommutes] = useState({});

  useEffect(() => {
      const loadCommutes = async () => {
          const storedCommutes = await getCommutes();
          setCommutes(storedCommutes);
          console.log(Object.keys(storedCommutes).length);
      };
      loadCommutes();
  }, []);

  return (
    <View style={commonStyles.container}>
      <BottomSheet
        halfHeight={SCREEN_HEIGHT * 0.5}
        onDismiss={() => router.replace("/home")}
        onModeChange={(newMode) => {
          console.log("Commutes mode updated to:", newMode);
          // Optionally update global context if needed
        }}
      >
          
          <Text style={commutesStyles.panelTitle}>Your Commutes</Text>
          <ScrollView>
                      {Object.keys(commutes).length > 0 ? (
                          Object.values(commutes).map((commute, index) => (
                              <TouchableOpacity key={index} style={commutesStyles.journeyButton}
                              onPress={() => router.push({
                                      pathname: "/commuteTestScreen",
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
                                      },
                                    })}>
                                <FontAwesome name="pencil" size={20} color="black" />
                                <Text style={commutesStyles.journeyText}>{commute.name}</Text>
                              </TouchableOpacity>
                          ))
                      ) : (
                          <Text style={commutesStyles.journeyText}>No saved commutes found.</Text>
                      )}
                  </ScrollView>

          <TouchableOpacity
          style={commutesStyles.addButton}
          onPress={() => router.push("/commuteTestScreen")}
        >
          <Ionicons name="add-outline" size={24} color="black" />
          <Text style={commutesStyles.journeyText}>Add</Text>
        </TouchableOpacity>
      </BottomSheet>

      <View style={commutesStyles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Ionicons name="settings-outline" size={28} color="#DC9F85" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
