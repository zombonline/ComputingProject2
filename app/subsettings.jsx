// app/subsettings.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "../components/BottomSheet";
import { subSettingStyles } from "./style";
import { auth } from "@/app/utils/firebaseConfig";
import Slider from '@react-native-community/slider';



export default function SettingDetail() {
  const router = useRouter();
  const { setting } = useLocalSearchParams();
  const { height: SCREEN_HEIGHT } = Dimensions.get("window");
  const [contentHeight, setContentHeight] = useState(0);
  const [displayName, setDisplayName] = useState("Anonymous");
  const [email, setEmail] = useState("No email available");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [issavePressed, setsavePressed] = useState(false);
  const NAV_BAR_HEIGHT = 600;
   // Calculate available height for scrollable content:
   const [panelHeight, setPanelHeight] = useState(SCREEN_HEIGHT * 0.5);
   const availableHeight = panelHeight - NAV_BAR_HEIGHT;

   // Determine if scrolling should be enabled:
   const isScrollable = contentHeight > availableHeight;

   useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setEmail(user.email || "");
          setDisplayName(user.displayName || "" );

          
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const settingConfig = {
    notifications: {
      title: "Notifications Settings",
      switchLabel: "Enable/disable Notifications",
      dropdownLabel: "Notification Occurrence",
      // dropdownOptions are no longer needed for checkboxes, so you might remove them or repurpose as needed
    },
    accessibility: {
      title: "Accessibility Settings",
      switchLabel: null,
      dropdownLabel: "Theme",
      dropdownOptions: ["No escalators", "Use stairs, no escalator", "Step to platform only", "Full step-free access"],
    },
    commute: {
      title: "Commute Settings",
      switchLabel: null,
      dropdownLabel: "Mode of Transport",
      dropdownOptions: ["Bike", "Bus", "DLR", "Underground", "Elisabeth Line", "Overground", "National rail"],
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
        onHeightChange={(h) => setPanelHeight(h)}
      >
        <View style={{ flex: 1 }}>
          {/* Fixed header */}
          <Text style={subSettingStyles.panelTitle}>{title}</Text>

          {/* Scrollable content */}
          <ScrollView
            scrollEnabled={isScrollable}
            contentContainerStyle={{
              paddingBottom: NAV_BAR_HEIGHT, // ensures extra space for nav bar
            }}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setContentHeight(height);
            }}
          >
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
                  onChangeText={(text) => console.log("Last Name", text)}
                  placeholder="Last Name"
                  placeholderTextColor="#ccc"
                />
              </View>
            </View>
            <View style={subSettingStyles.inputGroup}>
            <View style={{ flex:1 }}>
              <Text style={subSettingStyles.inputLabel}>Email</Text>
              <TextInput
                style={subSettingStyles.inputField}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#ccc"
              />
            </View>
            </View>
            <View style={subSettingStyles.inputGroup}>
            <View style={{ flex:1}}>
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
            </View>
            <View style={subSettingStyles.inputGroup}>
            <View style={{ flex:1 }}>
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
            </View>
            <TouchableOpacity
             onPressIn={() => setsavePressed(true)}
             onPressOut={() => setsavePressed(false)}
       
              onPress={() => {
                console.log("Saved changes for account settings");
                // SAVE LOGIC.....
              }}
              style={[
                subSettingStyles.saveButton,
                  issavePressed && { borderColor: "#ff6666" },
                ]}
              >
              <Text style={subSettingStyles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </BottomSheet>
      
    );}


   // Shared state for switch and dropdown
   const [isEnabled, setIsEnabled] = useState(false);
   const toggleSwitch = () => setIsEnabled((prev) => !prev);
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
 
   // State for notifications slider, only used if setting === 'notifications'
   const [notificationTime, setNotificationTime] = useState(15);
     // separate state for text input as a string
  const [inputValue, setInputValue] = useState("15");

  // When the slider changes, update both states.
  const handleSliderChange = (value) => {
    const roundedValue = Math.round(value);
    setNotificationTime(roundedValue);
    setInputValue(String(roundedValue));
  };

  // As the user types, update the inputValue state.
  // If the value is valid (between 1 and 30), update notificationTime too.
  const handleInputChange = (value) => {
    // Allow user to input freely, even incomplete numbers
    setInputValue(value);

    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= 30) {
      setNotificationTime(num);
    }
  };

  // On blur, if the entered value is invalid or below 1, reset it to the current valid value.
  const handleInputBlur = () => {
    const num = parseInt(inputValue, 10);
    if (isNaN(num) || num < 1) {
      setInputValue(String(notificationTime));
    }
  };

   // State for checkbox options (commute) if needed
  const [checkedOptions, setCheckedOptions] = useState(
    dropdownOptions && setting !== "accessibility"
      ? new Array(dropdownOptions.length).fill(false)
      : []
  );
  
   const toggleCheckbox = (index) => {
     setCheckedOptions((prev) =>
       prev.map((val, i) => (i === index ? !val : val))
     );
   };

   // State for accessibility radio selection (only one option can be selected)
  const [selectedOption, setSelectedOption] = useState(null);
  const handleRadioSelect = (index) => {
    setSelectedOption(index);
  };
 
   // Render dropdown content depending on setting type
  const renderDropdownContent = () => {
    // For notifications, show slider with input field.
    if (setting === "notifications") {
      return (
        <View style={subSettingStyles.sliderContainer}>
          <TextInput
            style={subSettingStyles.input}
            value={inputValue}
            keyboardType="numeric"
            onChangeText={handleInputChange}
            onBlur={handleInputBlur}
            maxLength={2} // Allow numbers between 1 and 30
          />
          <Slider
            style={subSettingStyles.slider}
            minimumValue={1} // Minimum is now 1
            maximumValue={30}
            step={1}
            value={notificationTime}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#DC9F55"
            maximumTrackTintColor="#000"
            thumbTintColor="#fff"
          />
        </View>
      );
    }

    // For accessibility, render radio buttons
    if (setting === "accessibility" && dropdownOptions) {
      return (
        <View style={subSettingStyles.dropdownList}>
          {dropdownOptions.map((option, index) => (
            <TouchableOpacity
              key={option}
              style={subSettingStyles.optionRow}
              onPress={() => handleRadioSelect(index)}
            >
              <View style={subSettingStyles.radioCircle}>
                {selectedOption === index && <View style={subSettingStyles.selectedRb} />}
              </View>
              <Text style={subSettingStyles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    // For other settings with dropdownOptions (e.g., commute), render checkboxes.
    if (dropdownOptions) {
      return (
        <View style={subSettingStyles.dropdownList}>
          {dropdownOptions.map((option, index) => (
            <TouchableOpacity
              key={option}
              style={subSettingStyles.optionRow}
              onPress={() => toggleCheckbox(index)}
              
            >
              <View style={subSettingStyles.checkboxContainer}>
                <Checkbox
                  value={checkedOptions[index]}
                  onValueChange={() => toggleCheckbox(index)}
                  style={subSettingStyles.checkbox}
                  color="#DC9F55" 
                />
              </View>
              <Text style={subSettingStyles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    
    return null;
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

      {isDropdownOpen && renderDropdownContent()}
    </BottomSheet>
  );
}