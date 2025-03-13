import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { commonStyles, settingsStyles } from "./style"; // Import styles from style.js

const Settings = () => {
  const router = useRouter();

  return (
    <View style={commonStyles.container}>

      {/* Settings Panel */}
      <View style={settingsStyles.settingsPanel}>
        <Text style={settingsStyles.panelTitle}>Settings</Text>

        {/* Settings Buttons */}
        <TouchableOpacity
          style={settingsStyles.settingButton}
          onPress={() => router.push("/settings/notifications")}
        >
          <FontAwesome5 name="phone" size={18} color="black" style={settingsStyles.icon} />
          <Text style={settingsStyles.optionText}>Notifications Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={settingsStyles.settingButton}
          onPress={() => router.push("/settings/accessibility")}
        >
          <FontAwesome5 name="universal-access" size={18} color="black" style={settingsStyles.icon} />
          <Text style={settingsStyles.optionText}>Accessibility Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={settingsStyles.settingButton}
          onPress={() => router.push("/settings/commute")}
        >
          <FontAwesome5 name="bus" size={18} color="black" style={settingsStyles.icon} />
          <Text style={settingsStyles.optionText}>Commute Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={settingsStyles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Ionicons name="settings-outline" size={28} color="#DC9F85" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;
