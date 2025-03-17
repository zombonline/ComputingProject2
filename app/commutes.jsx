import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Feather";
import { commonStyles, commutesStyles } from "./style";
import BottomSheet from "../components/BottomSheet";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Commutes() {
  const router = useRouter();

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
          
          <Text style={commutesStyles.panelTitle}>Choose Journey</Text>

          <TouchableOpacity style={commutesStyles.journeyButton}>
            <Ionicons name="home-outline" size={24} color="black" />
            <Text style={commutesStyles.journeyText}>Home</Text>
            <FontAwesome name="pencil" size={20} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={commutesStyles.journeyButton}>
            <Ionicons name="briefcase-outline" size={24} color="black" />
            <Text style={commutesStyles.journeyText}>Work</Text>
            <FontAwesome name="pencil" size={20} color="black" />
          </TouchableOpacity>

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
