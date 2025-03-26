import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import { Ionicons } from "@expo/vector-icons";
import { commonStyles, accountStyles } from "./style";
import BottomSheet from "../components/BottomSheet";
import { auth } from "@/app/utils/firebaseConfig"; 
import { onAuthStateChanged } from "firebase/auth";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Account() {
  const router = useRouter();
  const [panelHeight, setPanelHeight] = useState(SCREEN_HEIGHT * 0.5);
  const [isLoginPressed, setLoginPressed] = useState(false);
  const [isLogoutPressed, setLogoutPressed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("Anonymous");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName || "Anonymous");
      } else {
        setDisplayName("Anonymous");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={commonStyles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
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
        <View style={{ height: panelHeight, flex: 1 }}>
          <View>
            <Text style={accountStyles.panelTitle}>Profile</Text>
            <View style={accountStyles.userIconContainer}>
              <Icon name="user" size={60} color="#000" />
            </View>
            <Text style={accountStyles.userName}>{displayName}</Text>

            {/* Account Settings Navigation */}
            <TouchableOpacity
              style={accountStyles.accountSettingsButton}
              onPress={() => router.push("/subsettings?setting=account")}
            >
              <Icon
                name="settings"
                size={24}
                color="#000"
                style={accountStyles.settingsIcon}
              />
              <Text style={accountStyles.accountSettingsText}>
                Account Settings
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: "auto", marginBottom: 240 }}>
            <View style={accountStyles.loginRow}>
              {/* Log In Button */}
              <TouchableOpacity
                onPressIn={() => setLoginPressed(true)}
                onPressOut={() => setLoginPressed(false)}
                onPress={() => {
                  console.log("Navigating to /login");
                  router.push("/login");
                }}
                style={[
                  accountStyles.loginButton,
                  isLoginPressed && { borderColor: "#00ff00" },
                ]}
              >
                <Text style={accountStyles.loginButtonText}>Log In</Text>
              </TouchableOpacity>

              {/* Log Out Button */}
              <TouchableOpacity
                onPressIn={() => setLogoutPressed(true)}
                onPressOut={() => setLogoutPressed(false)}
                onPress={() => {
                  auth.signOut().then(() => {
                    console.log("User signed out");
                    router.replace("/home");
                  });
                }}
                style={[
                  accountStyles.logoutButton,
                  isLogoutPressed && { borderColor: "#ff6666" },
                ]}
              >
                <Text style={accountStyles.logoutButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BottomSheet>

      {/* Bottom Navigation */}
      <View style={accountStyles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Ionicons name="settings-outline" size={28} color="#DC9F85" />
        </TouchableOpacity>
      </View>
    </>
  );
}
