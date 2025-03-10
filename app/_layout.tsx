import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Slot, useRouter, usePathname } from "expo-router";

const Layout = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get current route

  return (
    <View style={styles.container}>
      {/* Page Content */}
      <View style={styles.pageContent}>
        <Slot /> {/* This loads the current screen */}
      </View>

      {/* Hide Bottom Nav on the Index Page ("/") */}
      {pathname !== "/" && (
        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <Ionicons
              name="settings-outline"
              size={28}
              color={pathname === "/settings" ? "#DC9F85" : "white"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/commuteTestScreen")}>
            <Ionicons
              name="home-outline"
              size={28}
              color={pathname === "/commutes" ? "#DC9F85" : "white"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Ionicons
              name="person-outline"
              size={28}
              color={pathname === "/profile" ? "#DC9F85" : "white"}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageContent: {
    flex: 1, // Allows the page content to take full height
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#333",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default Layout;
