// app/subsettings.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import BottomSheet from "../components/BottomSheet";
import { subSettingStyles } from "./style";

export default function SettingDetail() {
  const router = useRouter();
  const { setting } = useLocalSearchParams();
  const { height: SCREEN_HEIGHT } = Dimensions.get("window");

  // Configuration to handle 'account'
  const settingConfig = {
    notifications: {
      title: "Notifications Settings",
      switchLabel: "Enable/disable Notifications",
      dropdownLabel: "Notification Occurrence",
      dropdownOptions: ["Daily", "Weekdays", "Weekends"],
    },
    accessibility: {
      title: "Accessibility Settings",
      switchLabel: null,
      dropdownLabel: "Theme",
      dropdownOptions: ["Light Theme", "Dark Theme", "Colour Blind"],
    },
    commute: {
      title: "Commute Settings",
      switchLabel: null,
      dropdownLabel: "Mode of Transport",
      dropdownOptions: ["ASAP", "Stop Freq", "Lowest Fare"],
    },
 
    account: {
      title: "Account Settings",
      isAccountScreen: true, // we'll handle this differently
    },
  };

  if (!setting || !settingConfig[setting]) {
    return (
      <View style={subSettingStyles.container}>
        <Text style={subSettingStyles.errorText}>Invalid Setting</Text>
      </View>
    );
  }

  const { title, switchLabel, dropdownLabel, dropdownOptions, isAccountScreen } =
    settingConfig[setting];

  // Account screen
  if (isAccountScreen) {
    return (
      <BottomSheet
        halfHeight={SCREEN_HEIGHT * 0.5}
        onDismiss={() => router.replace("/home")}
        onModeChange={(newMode) => {
          console.log("Account subsetting mode updated to:", newMode);
        }}
      >
        <Text style={subSettingStyles.panelTitle}>{title}</Text>

        {/* Account form fields */}
        <View style={subSettingStyles.inputGroup}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={subSettingStyles.inputLabel}>First Name</Text>
            <TextInput
              style={subSettingStyles.inputField}
              placeholder="First Name"
              placeholderTextColor="#ccc"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={subSettingStyles.inputLabel}>Last Name</Text>
            <TextInput
              style={subSettingStyles.inputField}
              placeholder="Last Name"
              placeholderTextColor="#ccc"
            />
          </View>
          </View>

          <View style={{ marginBottom: 15 }}>
          <Text style={subSettingStyles.inputLabel}>Email</Text>
          <TextInput
            style={subSettingStyles.inputField}
            placeholder="Email"
            placeholderTextColor="#ccc"
          />
        </View>

<View style={{ marginBottom: 15 }}>
  <Text style={subSettingStyles.inputLabel}>Password</Text>
  <TextInput
    style={subSettingStyles.inputField}
    placeholder="Password"
    secureTextEntry
    placeholderTextColor="#ccc"
  />
</View>

        <TouchableOpacity
          style={subSettingStyles.saveButton}
          onPress={() => {
            console.log("Saved changes for account settings");
          }}
        >
          <Text style={subSettingStyles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </BottomSheet>
    );
  }

  // Otherwise, handle existing logic for notifications, accessibility, commute
  // Local state for switch
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((prev) => !prev);

  // Local state for dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  // Local state for checkboxes
  const [checkedOptions, setCheckedOptions] = useState(
    new Array(dropdownOptions.length).fill(false)
  );
  const toggleCheckbox = (index) => {
    setCheckedOptions((prev) =>
      prev.map((val, i) => (i === index ? !val : val))
    );
  };

  return (
    <BottomSheet
      halfHeight={SCREEN_HEIGHT * 0.5}
      onDismiss={() => router.replace("/home")}
      onModeChange={(newMode) => {
        console.log("Subsettings mode updated to:", newMode);
      }}
    >
      <Text style={subSettingStyles.panelTitle}>Settings</Text>
      <Text style={subSettingStyles.subHeader}>{title}</Text>

      {switchLabel && (
        <View style={subSettingStyles.switchRow}>
          <Text style={subSettingStyles.switchLabel}>{switchLabel}</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      )}

      {dropdownLabel && (
        <TouchableOpacity
          style={subSettingStyles.dropdownRow}
          onPress={toggleDropdown}
        >
          <Text style={subSettingStyles.dropdownLabel}>{dropdownLabel}</Text>
          <Ionicons
            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#fff"
            style={subSettingStyles.dropdownIcon}
          />
        </TouchableOpacity>
      )}

      {isDropdownOpen && dropdownOptions && (
        <View style={subSettingStyles.dropdownList}>
          {dropdownOptions.map((option, index) => (
            <View key={option} style={subSettingStyles.optionRow}>
              <Checkbox
                value={checkedOptions[index]}
                onValueChange={() => toggleCheckbox(index)}
                style={subSettingStyles.checkbox}
              />
              <Text style={subSettingStyles.optionText}>{option}</Text>
            </View>
          ))}
        </View>
      )}
    </BottomSheet>
  );
}
