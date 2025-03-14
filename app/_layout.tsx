import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Slot, useRouter, usePathname } from "expo-router";
import { commonStyles } from "./style";

const Layout = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Pages that should NOT show the search bar
  const excludedSearch = ["/", "/commuteTestScreen", "/login", "/signup"];
  
  // Pages that should NOT show the bottom nav
  const excludedBottomNav = ["/", "/login", "/signup"];

  return (
    <View style={styles.container}>
      {/* Conditionally render the search bar */}
      {!excludedSearch.includes(pathname) && (
        <View style={commonStyles.searchContainer}>
          <FontAwesome name="search" size={20} color="black" style={commonStyles.searchIcon} />
          <TextInput placeholder="Search location" style={commonStyles.searchInput} />
        </View>
      )}

      {/* The current screen */}
      <View style={styles.pageContent}>
        <Slot />
      </View>

      {/* Conditionally render the bottom nav */}
      {!excludedBottomNav.includes(pathname) && (
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
              color={pathname === "/commuteTestScreen" ? "#DC9F85" : "white"}
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
  container: { flex: 1 },
  pageContent: { flex: 1 },
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
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});

export default Layout;
