import React from "react";
import { Platform, View, TextInput, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { commonStyles } from "./style";

const HomeScreen = () => {
  return (
    <View style={commonStyles.container}>
      {/* Search Bar */}
      <View style={commonStyles.searchContainer}>
        <FontAwesome name="search" size={20} color="black" style={commonStyles.searchIcon} />
        <TextInput placeholder="Search location" style={commonStyles.searchInput} />
      </View>
    </View>
  );
};

export default HomeScreen;
