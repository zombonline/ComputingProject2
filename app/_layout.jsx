import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Slot, useRouter, usePathname } from "expo-router";
import { commonStyles } from "./style";

const Layout = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get current route

  // Define pages where the search bar or bottom nav should be hidden
  const excludedSearch = ["/", "/commuteTestScreen","/signup","/login" ];
  const excludedBottomNav = ["/","/login","/signup"];

  return (
    <View style={styles.container}>
      {/* Show Search Bar only if the page is NOT in excludedRoutes */}
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

      {/* Show Bottom Nav only if the page is NOT in excludedRoutes */}
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
          <TouchableOpacity onPress={() => router.push("/commutes")}>
            <Ionicons
              name="bus-outline"
              size={28}
              color={pathname === "/commutes" ? "#DC9F85" : "white"}
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
