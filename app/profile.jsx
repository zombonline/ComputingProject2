// app/profile.jsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import { Ionicons } from "@expo/vector-icons";
import { commonStyles, accountStyles } from "./style";
import BottomSheet from "../components/BottomSheet";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Account() {
  const router = useRouter();
  const [panelHeight, setPanelHeight] = useState(SCREEN_HEIGHT * 0.5);

  return (
    <View style={commonStyles.container}>
      <BottomSheet
        halfHeight={SCREEN_HEIGHT * 0.5}
        onDismiss={() => router.replace("/home")}
        onModeChange={(newMode) => {
          console.log("Profile mode updated to:", newMode);
        }}
        onHeightChange={(h) => {
          setPanelHeight(h);
        }}
      >
        <View style={{ height: panelHeight, paddingHorizontal: 20, paddingVertical: 10, flex: 1 }}>
          <View>
            <Text style={accountStyles.panelTitle}>Profile</Text>
            <View style={accountStyles.userIconContainer}>
              <Icon name="user" size={60} color="#000" />
            </View>
            <Text style={accountStyles.userName}>John Smith</Text>

            {/* Navigate to /subsettings with ?setting=account */}
            <TouchableOpacity
              style={accountStyles.accountSettingsButton}
              onPress={() => router.push("/subsettings?setting=account")}
            >
              <Icon name="settings" size={24} color="#000" style={accountStyles.settingsIcon} />
              <Text style={accountStyles.accountSettingsText}>Account Settings</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: "auto", marginBottom: 120 }}>
            <View style={accountStyles.loginRow}>
              <TouchableOpacity
                style={accountStyles.loginButton}
                onPress={() => {
                  console.log("Navigating to /login");
                  router.push("/login");
                }}
              >
                <Text style={accountStyles.loginButtonText}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={accountStyles.logoutButton}>
                <Text style={accountStyles.logoutButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BottomSheet>

      <View style={accountStyles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Ionicons name="settings-outline" size={28} color="#DC9F85" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
