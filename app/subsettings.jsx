import React, { useState, useContext } from "react";
import { View, Text, Switch, TouchableOpacity, TextInput, Dimensions } from "react-native";
import Checkbox from "expo-checkbox";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import BottomSheet from "../components/BottomSheet"; // Adjust path as needed
import { subSettingStyles,  } from "./style"; // Adjust path as needed


export default function SettingDetail() {
  const router = useRouter();
  const { setting } = useLocalSearchParams(); 
  const { height: SCREEN_HEIGHT } = Dimensions.get("window");

  // Configuration for each sub-setting
  const settingConfig = {
    notifications: {
      title: "Notifications Settings",
      switchLabel: "Enable/disable Notifications",
      dropdownLabel: "Notification Occurrence",
      dropdownOptions: ["Daily", "Weekdays", "Weekends"],
    },
    accessibility: {
      title: "Accessibility Settings",
      switchLabel: null, // Define switch (Optional)
      dropdownLabel: "Theme",
      dropdownOptions: ["Light Theme", "Dark Theme", "Colour Blind"],
    },
    commute: {
      title: "Commute Settings",
      switchLabel: null,
      dropdownLabel: "Mode of Transport",
      dropdownOptions: ["ASAP", "Stop Freq", "Lowest Fare"],
    },
  };

  if (!setting || !settingConfig[setting]) {
    return (
      <View style={subSettingStyles.container}>
        <Text style={subSettingStyles.errorText}>Invalid Setting</Text>
      </View>
    );
  }

  const { title, switchLabel, dropdownLabel, dropdownOptions } = settingConfig[setting];

  // Local state for switch (if needed)
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((prev) => !prev);

  // Local state for dropdown (to show/hide the options)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  // Local state for checkboxes (one per dropdown option)
  const [checkedOptions, setCheckedOptions] = useState(
    new Array(dropdownOptions.length).fill(false)
  );
  const toggleCheckbox = (index) => {
    setCheckedOptions((prev) =>
      prev.map((val, i) => (i === index ? !val : val))
    );
  };

  return (
    <>

      {/* Wrap the panel content in your interactive BottomSheet */}
      <BottomSheet
        halfHeight={SCREEN_HEIGHT * 0.5}
        onDismiss={() => router.replace("/home")}
        onModeChange={(newMode) => {
          console.log("Subsettings mode updated to:", newMode);
          // This could update the global mode if needed.
        }}
      >
        {/* Panel header */}
        <Text style={subSettingStyles.panelTitle}>Settings</Text>
        <Text style={subSettingStyles.subHeader}>{title}</Text>

        {/* Render switch row if a switchLabel is provided */}
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

        {/* Dropdown row with an arrow */}
        <TouchableOpacity style={subSettingStyles.dropdownRow} onPress={toggleDropdown}>
          <Text style={subSettingStyles.dropdownLabel}>{dropdownLabel}</Text>
          <Ionicons
            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#fff"
            style={subSettingStyles.dropdownIcon}
          />
        </TouchableOpacity>

        {/* Inline checkboxes when dropdown is open */}
        {isDropdownOpen && (
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
    </>
  );
}
