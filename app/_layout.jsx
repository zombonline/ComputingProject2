// app/_layout.jsx
import { View, TextInput, TouchableOpacity } from "react-native";
import { Slot, useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { bottomNavStyle, searchBarStyle } from "./style";
import { SettingsPanelModeProvider } from "./utils/SettingsPanelModeContext";
import GoogleMap from "./utils/googlemap";
import { StyleSheet } from "react-native";
// Inner Layout component that uses the context.
function Layout() {
  const router = useRouter();
  const pathname = usePathname();

  // Define pages where the search bar should always be hidden.
  const excludedSearch = [
    "/",
    "/altJourneys",
    "/commuteEdit",
    "/settings",
    "/subsettings",
    "/profile",
    "/commutes",
    "/login",
    "/signup",
  ];

  // For other routes: show the search bar (if not in excludedSearch)
  const showSearch = !excludedSearch.includes(pathname);

  // Define pages where bottom navigation is hidden.
  const excludedBottomNav = ["/"];

  return (
    <>
      {showSearch && (
        <View style={searchBarStyle.container}>
          <FontAwesome
            name="search"
            size={20}
            color="black"
            style={searchBarStyle.icon}
          />
          <TextInput
            onPress={() => router.push("/commuteEdit")}
            placeholder="Search location"
            style={searchBarStyle.input}
          />
        </View>
      )}

      {/* The current screen */}
      <View style={{ flex: 1, backgroundColor: "transparent", zIndex: 1 }}>
        <GoogleMap
          style={{
            ...StyleSheet.absoluteFillObject,
            zIndex: 0,
          }}
        />
        <Slot />
      </View>

      {!excludedBottomNav.includes(pathname) && (
        <>
          <View
            style={{
              ...bottomNavStyle,
              marginBottom: 2,
              width: "100%",
              alignSelf: "center",
              backgroundColor: "#363636",
            }}
          >
            <Ionicons
              name="settings-outline"
              size={28}
              color={pathname === "/settings" ? "#DC9F55" : "white"}
            />
          </View>
          <View style={bottomNavStyle}>
            <TouchableOpacity onPress={() => router.push("/settings")}>
              <Ionicons
                name="settings-outline"
                size={28}
                color={pathname === "/settings" ? "#DC9F55" : "white"}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/commutes")}>
              <Ionicons
                name="bus-outline"
                size={28}
                color={pathname === "/commutes" ? "#DC9F55" : "white"}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/profile")}>
              <Ionicons
                name="person-outline"
                size={28}
                color={pathname === "/profile" ? "#DC9F55" : "white"}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
}

// Single default export that wraps Layout in the global provider.
export default function LayoutWrapper() {
  return (
    <SettingsPanelModeProvider>
      <Layout />
    </SettingsPanelModeProvider>
  );
}
