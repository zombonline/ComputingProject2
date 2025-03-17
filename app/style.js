import { StyleSheet, Platform } from "react-native";

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  searchContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 50,
    elevation: 3,
    zIndex: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1, 
    fontSize: 16 
  },
  searchText: {
    fontSize: 16,
    color: "gray",
  },
  Panel: {
    position: "absolute",
    bottom: 0, // raise above bottom nav if needed
    left: 0,
    right: 0,
    backgroundColor: "#33333e",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    alignItems: "center",
  },
   chevronUp: {
    alignItems: "center",
    padding: 10,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },

  settingButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: "90%",
    marginTop: 18,
    borderColor: "grey",
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

// Styles for index.jsx (Splash Screen)
export const indexStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#33333E",
  },
  logoImage: {
    width: 150,
    height: 150,
    alignSelf: "center",
    resizeMode: "contain",
  },
  activityIndicator: {
    marginTop: 300,
  },
});

// Styles for settings.jsx
export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  container: commonStyles.container,

  searchBarContainer: commonStyles.searchContainer,
  searchIcon: commonStyles.searchIcon,
  searchInput: commonStyles.searchInput,
  searchText: commonStyles.searchText,
  chevronUp: commonStyles.chevronUp,
  panelTitle: commonStyles.panelTitle,
  settingsPanel: commonStyles.Panel,

  // Each white button in the panel
  settingButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
  },
  bottomNav: commonStyles.bottomNav,
  navItem: commonStyles.navItem,
});

// Styles for `subsettings.jsx`
export const subSettingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0", // Light grey behind the dark panel
  },

  chevronUp: commonStyles.chevronUp,
  panelTitle:commonStyles.panelTitle,
  settingsPanel: commonStyles.Panel,
  searchContainer: commonStyles.searchContainer,
  searchIcon: commonStyles.searchIcon,
  searchInput: commonStyles.searchInput,
  // Arrow icon at the top center
  
  // Sub-header for this specific setting
  subHeader: {
    fontSize: 16,
    color: "#FFF",
    marginVertical: 10,
    textAlign: "center",
  },

  // Switch row
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: "#FFF",
  },

  // Dropdown row
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dropdownLabel: {
    fontSize: 16,
    color: "#FFF",
  },
  dropdownIcon: {
    marginLeft: 10,
  },

  // The container for checkboxes once the dropdown is open
  dropdownList: {
    marginBottom: 10,
  },

  // Each checkbox row: checkbox on left, text on right
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#FFF",
  },

  // If invalid param
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

// Styles for commuteTestScreen.tsx
export const commuteTestStyles = StyleSheet.create({
  container: commonStyles.container,
  Panel:  commonStyles.Panel,
  imageBackground: commonStyles.imageBackground,
  searchBarContainer: commonStyles.searchContainer,
  searchIcon: commonStyles.searchIcon,
  searchInput: commonStyles.searchInput,
  searchText: commonStyles.searchText,
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: "90%",
    marginTop: 18,
    borderColor: "grey",
    color: "white",
  },
  journeyButton: {
    borderRadius: 10,
    backgroundColor: "red",
    padding: 10,
    width: "90%",
    marginTop: 10,
    borderColor: "grey",
  },
  journeyButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  scrollView: {
    width: "90%",
    margin: 20,
    borderWidth: 1,
  },
  listItem: {
    color: "white",
    fontSize: 16,
  },
});

// Styles for profile.jsx
export const accountStyles = StyleSheet.create({
  container: commonStyles.container,
  imageBackground: commonStyles.imageBackground,
  searchBarContainer: commonStyles.searchContainer,
  searchIcon: commonStyles.searchIcon,
  searchInput: commonStyles.searchInput,
  Panel: commonStyles.Panel,
  panelTitle:commonStyles.panelTitle,
  chevronUp: commonStyles.chevronUp,
  
  userIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    alignSelf: "center",
  },
  userName: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
    alignSelf: "center",
  },
  accountSettingsButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 20,
    alignSelf: "center", // Center the button horizontally
  },
  settingsIcon: {
    marginRight: 8,
    alignItems: "center",
  },
  accountSettingsText: {
    fontSize: 16,
    color: "#fff",
    alignItems: "center",
  },
  loginRow: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  loginButton: {
    backgroundColor: "limegreen",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loginButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "red",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  bottomNav: commonStyles.bottomNav,
  navItem: commonStyles.navItem,
});
export const commutesStyles = StyleSheet.create({
    container: commonStyles.container,

    searchBarContainer: commonStyles.searchContainer,
    searchIcon: commonStyles.searchIcon,
    searchInput: commonStyles.searchInput,
    searchText: commonStyles.searchText,
    chevronUp: commonStyles.chevronUp,
    panelTitle: commonStyles.panelTitle,
    Panel: commonStyles.Panel,
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
    bottomNav: commonStyles.bottomNav,
    navItem: commonStyles.navItem,
  });
