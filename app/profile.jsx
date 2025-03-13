import React from "react";
import { View, Text, TextInput, Image, TouchableOpacity, Platform } from "react-native";
import { Link, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import splashCoffee from "../assets/images/splash-coffee.jpg";
import { commonStyles, accountStyles } from "./style"; // Ajusta la ruta

export default function Account() {
  const router = useRouter();

  return (
    <View style={commonStyles.container}>
      <View style={accountStyles.bottomSection}>
        <Icon name="chevron-up" size={28} color="#fff" style={accountStyles.chevronUp} />
        <Text style={accountStyles.profileTitle}>Profile</Text>
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
            onPress={() => router.push("profile")}
          >
            <Text style={accountStyles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={accountStyles.logoutButton}>
            <Text style={accountStyles.logoutButtonText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
