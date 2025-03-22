import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import { Ionicons } from "@expo/vector-icons";
import { commonStyles, accountStyles } from "./style";
import BottomSheet from "../components/BottomSheet";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Account() {
  const router = useRouter();

  return (
    <View style={commonStyles.container}>
      <BottomSheet
        halfHeight={SCREEN_HEIGHT * 0.5}
        onDismiss={() => router.replace("/home")}
        onModeChange={(newMode) => {
          console.log("Profile mode updated to:", newMode);
          }}
      >
        
          <Text style={accountStyles.panelTitle}>Profile</Text>
          <View style={accountStyles.userIconContainer}>
            <Icon name="user" size={60} color="#000" />
          </View>
          <Text style={accountStyles.userName}>John Smith</Text>
          <TouchableOpacity
            style={accountStyles.accountSettingsButton}
            onPress={() => router.push("/profile")}
          >
            <Icon name="settings" size={24} color="#000" style={accountStyles.settingsIcon} />
            <Text style={accountStyles.accountSettingsText}>Account Settings</Text>
          </TouchableOpacity>
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
              <Text style={accountStyles.logoutButtonText}>Log out</Text>
            </TouchableOpacity>
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
