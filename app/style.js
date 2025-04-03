import { StyleSheet } from "react-native";

export const bottomNavStyle = StyleSheet.create({
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  backgroundColor: "#232323",
  paddingVertical: 10,
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  borderTopLeftRadius: 15,
  borderTopRightRadius: 15,
  zIndex: 2,
});

export const searchBarStyle = StyleSheet.create({
  container: {
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
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    color: "gray",
  },
});

export const backgroundColor = StyleSheet.create({
  backgroundColor: "#232323",
});

export const subSettingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0", // Light grey behind the dark panel
  },

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
export const dayButtonStyle = StyleSheet.create({
  selected: {
    width: 40,
    height: 40,
    backgroundColor: "#DC9F85",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  unselected: {
    width: 40,
    height: 40,
    backgroundColor: "#444",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  text: {
    color: "white",
    fontSize: 12,
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
export const textStyles = StyleSheet.create({
  panelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  errorTextStyle: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  whiteStandardStyle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  blackStandardStyle: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
  },
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
export const standardButtonStyle = StyleSheet.create({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "white",
  borderRadius: 10,
  padding: 15,
  marginBottom: 10,
  icon: {
    paddingRight: 10,
  },
});
export const userIconContainerStyle = StyleSheet.create({
  width: 90,
  height: 90,
  borderRadius: 45,
  backgroundColor: "#ddd",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 8,
  alignSelf: "center",
});
export const logButtonStyle = StyleSheet.create({
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "white",
  paddingHorizontal: 20,
  paddingVertical: 10,
  marginHorizontal: 30,
  minWidth: 100,
  pressed: {
    borderColor: "#ff6666",
  },
  logInColor: {
    backgroundColor: "rgba(0, 255, 0, 0.1)",
  },
  logOutColor: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
  },
});
