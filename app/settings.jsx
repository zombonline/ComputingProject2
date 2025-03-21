// app/settings.jsx
import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import BottomSheet from "../components/BottomSheet";
import { settingsStyles, commonStyles } from "./style";
import { SettingsPanelModeContext } from "./utils/SettingsPanelModeContext";


const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Settings() {
  const router = useRouter();
  const { setMode } = useContext(SettingsPanelModeContext);

  return (
    <View style={commonStyles.container} pointerEvents="box-none">
 
      <BottomSheet
        halfHeight={SCREEN_HEIGHT * 0.5}
        onDismiss={() => router.replace("/home")}
        onModeChange={(newMode) => {
          setMode(newMode);
          console.log("Mode updated to:", newMode);
        }}
      >
        <Text style={settingsStyles.panelTitle}>Settings</Text>

        {/* Each button navigates to /subsettings, passing the setting in a query param */}
        <TouchableOpacity
          style={settingsStyles.settingButton}
          onPress={() => router.push("/subsettings?setting=notifications")}
        >
          <FontAwesome5 name="phone" size={18} color="black" style={settingsStyles.icon} />
          <Text style={settingsStyles.optionText}>Notifications Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={settingsStyles.settingButton}
          onPress={() => router.push("/subsettings?setting=accessibility")}
        >
          <FontAwesome5 name="universal-access" size={18} color="black" style={settingsStyles.icon} />
          <Text style={settingsStyles.optionText}>Accessibility Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={settingsStyles.settingButton}
          onPress={() => router.push("/subsettings?setting=commute")}
        >
          <FontAwesome5 name="bus" size={18} color="black" style={settingsStyles.icon} />
          <Text style={settingsStyles.optionText}>Commute Settings</Text>
        </TouchableOpacity>
      </BottomSheet>

      <View style={settingsStyles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Ionicons name="settings-outline" size={28} color="#DC9F85" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
