// app/subsettings.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "../components/BottomSheet";
import { subSettingStyles } from "./style";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/utils/firebaseConfig";



export default function SettingDetail() {
  const router = useRouter();
  const { setting } = useLocalSearchParams();
  const { height: SCREEN_HEIGHT } = Dimensions.get("window");
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("Anonymous");
  const [email, setEmail] = useState("No email available");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setEmail(user.email || "No email available");
          setDisplayName(user.displayName || "Anonymous" );

          
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
      isAccountScreen: true,
    },
  };

  if (!setting || !settingConfig[setting]) {
    return (
      <View style={subSettingStyles.container}>
        <Text style={subSettingStyles.errorText}>Invalid Setting</Text>
      </View>
    );
  }

  const {
    title,
    switchLabel,
    dropdownLabel,
    dropdownOptions,
    isAccountScreen,
  } = settingConfig[setting];

  if (isAccountScreen) {
    return (
      <BottomSheet
        halfHeight={SCREEN_HEIGHT * 0.5}
        onDismiss={() => router.replace("/home")}
        onModeChange={(newMode) => {
          console.log("Account subsetting mode updated to:", newMode);
        }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={subSettingStyles.panelTitle}>{title}</Text>

          <View style={subSettingStyles.inputGroup}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={subSettingStyles.inputLabel}>First Name</Text>
              <TextInput
                style={subSettingStyles.inputField}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="First Name"
                placeholderTextColor="#ccc"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={subSettingStyles.inputLabel}>Last Name</Text>
              <TextInput
                style={subSettingStyles.inputField}
               
                onChangeText="Last Name"
                placeholder="Last Name"
                placeholderTextColor="#ccc"
              />
            </View>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={subSettingStyles.inputLabel}>Email</Text>
            <TextInput
              style={subSettingStyles.inputField}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#ccc"
            />
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={subSettingStyles.inputLabel}>Password</Text>
            <TextInput
              style={subSettingStyles.inputField}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="#ccc"
            />
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={subSettingStyles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={subSettingStyles.inputField}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
              secureTextEntry
              placeholderTextColor="#ccc"
            />
          </View>

          <TouchableOpacity
            style={subSettingStyles.saveButton}
            onPress={() => {
              console.log("Saved changes for account settings");
              // SAVE LOGIC.....
            }}
          >
            <Text style={subSettingStyles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </BottomSheet>
    );
  }

  // Other setting types
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((prev) => !prev);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
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
            trackColor={{ false: "#000", true: "#DC9F55" }}
            thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
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
