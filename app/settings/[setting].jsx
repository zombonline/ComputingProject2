import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { subSettingStyles } from "../style"; // Import styles

const settingOptions = {
  notifications: {
    title: "Notifications Settings",
    icon: "call-outline",
    options: ["Daily", "Weekdays", "Weekends"],
  },
  accessibility: {
    title: "Accessibility Settings",
    icon: "accessibility-outline",
    options: ["Light Theme", "Dark Theme", "Colour Blind"],
  },
  commute: {
    title: "Commute Settings",
    icon: "bus-outline",
    options: ["Shortest Route", "Least Transfers", "Cheapest"],
  },
};

const SettingDetail = () => {
  const { setting } = useLocalSearchParams();
  const currentSetting = settingOptions[setting];

  if (!currentSetting) {
    return (
      <View style={subSettingStyles.container}>
        <Text style={subSettingStyles.errorText}>Invalid Setting</Text>
      </View>
    );
  }

  const [checkedOptions, setCheckedOptions] = useState(
    new Array(currentSetting.options.length).fill(false)
  );

  const toggleCheckbox = (index: number) => {
    setCheckedOptions((prev) =>
      prev.map((value, i) => (i === index ? !value : value))
    );
  };

  return (
    <View style={subSettingStyles.container}>
      {/* Header */}
      <Text style={subSettingStyles.header}>{currentSetting.title}</Text>

      {/* Search Bar */}
      <View style={subSettingStyles.searchContainer}>
        <Ionicons name="search" size={20} color="black" style={subSettingStyles.searchIcon} />
        <Text style={subSettingStyles.searchText}>Search location</Text>
      </View>

      {/* Settings Panel */}
      <View style={subSettingStyles.settingsPanel}>
        <Text style={subSettingStyles.panelTitle}>
          <Ionicons name={currentSetting.icon} size={20} color="black" /> {currentSetting.title}
        </Text>

        {/* Checkbox List */}
        {currentSetting.options.map((option, index) => (
          <View key={index} style={subSettingStyles.optionContainer}>
            <Text style={subSettingStyles.optionText}>{option}</Text>
            <Checkbox value={checkedOptions[index]} onValueChange={() => toggleCheckbox(index)} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default SettingDetail;
