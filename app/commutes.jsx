import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const Commutes = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Journey</Text>
      
      <View style={styles.journeyContainer}>
        <TouchableOpacity style={styles.journeyButton}>
          <Ionicons name="home-outline" size={24} color="black" />
          <Text style={styles.journeyText}>Home</Text>
          <FontAwesome name="pencil" size={20} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.journeyButton}>
          <Ionicons name="briefcase-outline" size={24} color="black" />
          <Text style={styles.journeyText}>Work</Text>
          <FontAwesome name="pencil" size={20} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-outline" size={24} color="black" />
          <Text style={styles.journeyText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: 600,
  },
  title: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
  },
  journeyContainer: {
    backgroundColor: "#444",
    borderRadius: 10,
    padding: 10,
  },
  journeyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: "space-between",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
  },
  journeyText: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
});

export default Commutes;
