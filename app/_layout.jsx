// app/_layout.jsx
import React, { useContext, useEffect, useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Slot, useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { commonStyles } from "./style";
import { SettingsPanelModeProvider, SettingsPanelModeContext } from "./utils/SettingsPanelModeContext";

// This is your inner Layout component that uses the context.
function Layout() {
  const router = useRouter();
  const pathname = usePathname();
  const { mode } = useContext(SettingsPanelModeContext);
  const [localMode, setLocalMode] = useState(mode);

  useEffect(() => {
    console.log("Layout detected mode change:", mode);
    setLocalMode(mode);
  }, [mode]);

  console.log("Current pathname:", pathname);
  console.log("Settings panel mode (context):", mode);
  console.log("Local mode:", localMode);

  // Define pages where the search bar should always be hidden.
  const excludedSearch = ["/", "/commuteTestScreen"];
  // For settings routes: show search bar only if localMode is "half"
  // For other routes: show the search bar (if not in excludedSearch)
  const showSearch =
    !excludedSearch.includes(pathname) &&
    (pathname.startsWith("/settings") ? localMode === "half" : true);

  console.log("Computed showSearch:", showSearch);

  // Define pages where bottom navigation is hidden.
  const excludedBottomNav = ["/"];

  return (
    <View style={styles.container}>
      {showSearch && (
        <View style={commonStyles.searchContainer}>
          <FontAwesome
            name="search"
            size={20}
            color="black"
            style={commonStyles.searchIcon}
          />
          <TextInput
            placeholder="Search location"
            style={commonStyles.searchInput}
          />
        </View>
      )}

      {/* The current screen */}
      <View style={styles.pageContent}>
        <Slot />
      </View>

      {!excludedBottomNav.includes(pathname) && (
        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <Ionicons
              name="settings-outline"
              size={28}
              color={pathname === "/settings" ? "#DC9F85" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/commutes")}>
            <Ionicons
              name="bus-outline"
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
}

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

// This is the single default export that wraps your Layout in the global provider.
export default function LayoutWrapper() {
  return (
    <SettingsPanelModeProvider>
      <Layout />
    </SettingsPanelModeProvider>
  );
}
