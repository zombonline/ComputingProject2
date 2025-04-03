// app/settings.jsx
import React, { useContext } from "react";
import { Text, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import BottomSheet from "../components/BottomSheet";
import { standardButtonStyle, textStyles } from "./style";
import { SettingsPanelModeContext } from "./utils/SettingsPanelModeContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Settings() {
  const router = useRouter();
  const { setMode } = useContext(SettingsPanelModeContext);

  return (
    <>
      <BottomSheet
        halfHeight={SCREEN_HEIGHT * 0.5}
        onDismiss={() => router.replace("/home")}
        onModeChange={(newMode) => {
          setMode(newMode);
          console.log("Mode updated to:", newMode);
        }}
      >
        <Text style={textStyles.panelTitle}>Settings</Text>

        <TouchableOpacity
          style={standardButtonStyle}
          onPress={() => router.push("/subsettings?setting=notifications")}
        >
          <FontAwesome5
            name="phone"
            size={18}
            color="black"
            style={standardButtonStyle.icon}
          />
          <Text style={textStyles.blackStandardStyle}>
            Notifications Settings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={standardButtonStyle}
          onPress={() => router.push("/subsettings?setting=accessibility")}
        >
          <FontAwesome5
            name="universal-access"
            size={18}
            color="black"
            style={standardButtonStyle.icon}
          />
          <Text style={textStyles.blackStandardStyle}>
            Accessibility Settings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={standardButtonStyle}
          onPress={() => router.push("/subsettings?setting=commute")}
        >
          <FontAwesome5
            name="bus"
            size={18}
            color="black"
            style={standardButtonStyle.icon}
          />
          <Text style={textStyles.blackStandardStyle}>Commute Settings</Text>
        </TouchableOpacity>
      </BottomSheet>
    </>
  );
}
