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
import {
  textStyles,
  userIconContainerStyle,
  standardButtonStyle,
  logButtonStyle,
} from "./style";
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Determine if a user is logged in.
  const isLoggedIn = displayName !== "Anonymous";

  return (
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
          <Text style={textStyles.panelTitle}>Profile</Text>
          <View style={userIconContainerStyle}>
            <Icon name="user" size={60} color="#000" />
          </View>
          <Text
            style={{
              ...textStyles.whiteStandardStyle,
              alignSelf: "center",
              marginBottom: 20,
            }}
          >
            {displayName}
          </Text>

          {/* Account Settings Navigation */}
          <TouchableOpacity
            style={{
              ...standardButtonStyle,
              width: "50%",
              alignSelf: "center",
              marginBottom: 30,
              paddingVertical: 13,
            }}
            onPress={() => router.push("/subsettings?setting=account")}
          >
            <Icon
              name="settings"
              size={24}
              color="#000"
              style={standardButtonStyle.icon}
            />
            <Text style={textStyles.blackStandardStyle}>
              Account Settings
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: "auto", marginBottom: 240 }}>
          <View
            style={{
              flexDirection: "row",
              width: "80%",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            {isLoggedIn ? (
              // Render Log Out button if the user is logged in.
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
                  logButtonStyle,
                  logButtonStyle.logOutColor,
                  isLogoutPressed && { borderColor: "#ff6666" },
                ]}
              >
                <Text
                  style={{
                    ...textStyles.whiteStandardStyle,
                    fontWeight: "bold",
                  }}
                >
                  Log Out
                </Text>
              </TouchableOpacity>
            ) : (
              // Render Log In button if no user is logged in.
              <TouchableOpacity
                onPressIn={() => setLoginPressed(true)}
                onPressOut={() => setLoginPressed(false)}
                onPress={() => {
                  router.push("/login");
                }}
                style={[
                  logButtonStyle,
                  logButtonStyle.logInColor,
                  isLoginPressed && { borderColor: "#00ff00" },
                ]}
              >
                <Text
                  style={{
                    ...textStyles.whiteStandardStyle,
                    fontWeight: "bold",
                  }}
                >
                  Log In
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}
