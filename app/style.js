import BottomSheet from "@/components/BottomSheet";
import { StyleSheet, Platform } from "react-native";

export const LayoutStyles = StyleSheet.create({
  container: { flex: 1 },
  // The map fills the container and be at the bottom layer.
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  // Ensure the content is transparent so the map shows through.
  pageContent: {
    flex: 1,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  // Bottom navigation with a higher zIndex.
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    zIndex: 2,
  },
});

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  searchContainer: {
    position: "absolute",
    top: 50,
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
    fontSize: 16,
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
  panelTitle: commonStyles.panelTitle,
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
  // Container for each input + label
  inputGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flex: 1,
    marginTop: 0,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  // The label above the input field
  inputLabel: {
    color: "white",
    marginBottom: 5,
    fontSize: 16,
  },
  // The text input field itself
  inputField: {
    backgroundColor: "#0000",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 8,
    color: "white",
  },
  saveButton: {
    backgroundColor: "rgba(220, 159, 85, 0.3)",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 20,
    alignSelf: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    flex: 1,
    alignSelf: "center",
    color: "white",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#DC9F55",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#DC9F55",
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  checkboxContainer: {
    position: "relative",
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#DC9F55", // Orange stroke for the checkbox border
    borderRadius: 4,
  },
});

// Styles for commuteTestScreen.tsx
export const commuteTestStyles = StyleSheet.create({
  container: commonStyles.container,
  Panel: commonStyles.Panel,
  imageBackground: commonStyles.imageBackground,
  searchBarContainer: commonStyles.searchContainer,
  searchIcon: commonStyles.searchIcon,
  searchInput: commonStyles.searchInput,
  searchText: commonStyles.searchText,
  scrollView: {
    width: "90%",
    margin: 20,
    borderWidth: 1,
  },
  listItem: {
    color: "white",
    fontSize: 16,
  },
  daysButton: {
    width: 40,
    height: 40,
    backgroundColor: "#444",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  dayText: {
    color: "#FFF",
    fontSize: 12,
  },
  selectedDay: {
    backgroundColor: "#DC9F85",
  },
});

export const journeyButtonStyles = StyleSheet.create({
  unselected: {
    borderRadius: 10,
    backgroundColor: "white",
    color: "black",
    padding: 10,
    width: "100%",
    marginTop: 10,
  },
  selected: {
    borderRadius: 10,
    backgroundColor: "white",
    color: "white",
    padding: 10,
    width: "100%",
    marginTop: 10,
    borderColor: "blue",
    borderWidth: 3,
  },
});

export const errorTextStyle = StyleSheet.create({
  color: "red",
  fontSize: 14,
});

export const customInputStyle = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    width: "90%",
    marginTop: 10,
    borderColor: "grey",
    color: "white",
  },
  input_invalid: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: "90%",
    marginTop: 10,
    borderColor: "red",
    color: "white",
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
  panelTitle: commonStyles.panelTitle,
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
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 20,
    alignSelf: "center",
  },

  settingsIcon: {
    marginRight: 8,
    alignItems: "center",
  },
  accountSettingsText: {
    fontSize: 16,
    color: "black",
    alignItems: "center",
  },
  loginRow: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  loginButton: {
    backgroundColor: "rgba(0, 255, 0, 0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 30,
  },
  loginButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 30,
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
