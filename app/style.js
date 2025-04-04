import { StyleSheet, Dimensions } from "react-native";

// Get the screen width and compute sizes for inputs, logos, and buttons based on screen size
const { width: screenWidth } = Dimensions.get("window");
const computedInputWidth = screenWidth < 500 ? screenWidth * 0.7 : screenWidth * 0.25;
const logoSize = screenWidth * 0.25;
const buttonWidth = 140;

// -----------------------------------------------------------
// Styles for Login and Signup screens
// -----------------------------------------------------------
export const Loginsignup = StyleSheet.create({
  // The main container for the login/signup screen
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#232323", // Dark background color
  },
  // Style for the back arrow button (positioned at the top left)
  backArrow: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  // Container for the logo image
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  // Style for the logo image
  logo: {
    width: logoSize,
    height: logoSize,
  },
  // Container for the login header text
  loginContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  // Style for the login header text
  loginText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  // Additional header container style 
  headerContainer: {
    alignItems: "center",
    marginTop: 0,
  },
  // Style for header text (alternative to loginText)
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  // Container for grouping input fields together
  inputGroup: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  // Style for text input fields used in login/signup
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    width: computedInputWidth,
    height: 40, // Fixed height so the box doesn't resize with text
    color: "#fff"
  },
  // Container for the sign in/up button area
  buttonContainer: {
    alignItems: "center",
  },
  // Style for the button (row for icon and text)
  button: {
    flexDirection: "row", // Place element in a row (icon and text)
    alignItems: "center", // Center vertically
    justifyContent: "center", // Center horizontally
    backgroundColor: "#007AFF", // Blue background for the button
    paddingVertical: 12,
    borderRadius: 5,
    width: buttonWidth,
  },
  // Text style inside the button
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  // Container for the link that navigates to the sign-up screen
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  // Style for the link text "Sign up"
  linkText: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  // Style for displaying local user data 
  localDataText: {
    marginTop: 20,
    color: "#777",
    fontSize: 14,
  },
  // Style for the sign up prompt text
  signUpText: {
    fontSize: 16,
    color: "#fff",
  },
  // Style for error text messages on login/signup forms
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    width: computedInputWidth,
  },
  // Style for a disabled button state
  disabledButton: {
    backgroundColor: "rgb(12, 82, 115)",
  },
});

// -----------------------------------------------------------
// Styles for the Bottom Navigation Bar
// -----------------------------------------------------------
export const bottomNavStyle = StyleSheet.create({
  flexDirection: "row",             // Arrange nav items in a row
  justifyContent: "space-around",    // Evenly space nav items
  alignItems: "center",              // Center items vertically
  backgroundColor: "#232323",
  paddingVertical: 10,
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  borderTopLeftRadius: 15,
  borderTopRightRadius: 15,
  zIndex: 2,                        // Ensure it's above other content
});

// -----------------------------------------------------------
// Styles for the Search Bar Component
// -----------------------------------------------------------
export const searchBarStyle = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row", // Place icon and input in a row
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 50,
    elevation: 3,        // Adds shadow 
    zIndex: 2,           // Ensure it appears above other elements
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});

// -----------------------------------------------------------
// Helper Style for Background Color Only
// -----------------------------------------------------------
export const backgroundColor = StyleSheet.create({
  backgroundColor: "#232323",
});

// -----------------------------------------------------------
// Styles for Sub-Settings Screen Components
// -----------------------------------------------------------
export const subSettingStyles = StyleSheet.create({
  // Main container for sub-settings screen
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0", // Light grey background for the panel
  },
  // Style for sub-header text
  subHeader: {
    fontSize: 16,
    color: "#FFF",
    marginVertical: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  // Row style for a switch element
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  // Label for the switch
  switchLabel: {
    fontSize: 16,
    color: "#FFF",
  },
  // Row style for dropdown elements
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  // Label for the dropdown
  dropdownLabel: {
    fontSize: 16,
    color: "#FFF",
  },
  // Icon for the dropdown arrow
  dropdownIcon: {
    marginLeft: 10,
  },
  // Container for the dropdown list (checkboxes or options)
  dropdownList: {
    marginBottom: 10,
  },
  // Row style for each checkbox option
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  // Style for checkboxes in the options list
  checkbox: {
    marginRight: 10,
  },
  // Text style for each option
  optionText: {
    fontSize: 16,
    color: "#FFF",
  },
  // Error message style for sub-settings
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  // Container for an input group (label + input)
  inputGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flex: 1,
    marginTop: 0,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  // Label above an input field
  inputLabel: {
    color: "white",
    marginBottom: 5,
    fontSize: 16,
  },
  // Style for the input field in subsettings
  inputField: {
    backgroundColor: "#transparent",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 8,
    color: "white",
    height: 40,
  },
  // Style for the save button in subsettings
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
  // Text style for the save button
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  // Generic input text style
  input: {
    flex: 1,
    alignSelf: "center",
    color: "white",
  },
  // Style for a radio button circle
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
  // Style for the inner circle of a selected radio button
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#DC9F55",
  },
  // Option row style (used for radio buttons or checkboxes)
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  // Container for the checkbox element
  checkboxContainer: {
    position: "relative",
    marginRight: 10,
  },
  // Style for the checkbox itself
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#DC9F55", // Orange border for the checkbox
    borderRadius: 4,
  },
});

// -----------------------------------------------------------
// Styles for Day Selection Buttons
// -----------------------------------------------------------
export const dayButtonStyle = StyleSheet.create({
  // Style for a selected day button
  selected: {
    width: 40,
    height: 40,
    backgroundColor: "#DC9F85",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  // Style for an unselected day button
  unselected: {
    width: 40,
    height: 40,
    backgroundColor: "#444",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  // Text style for the day button
  text: {
    color: "white",
    fontSize: 12,
  },
});

// -----------------------------------------------------------
// Styles for Journey Buttons
// -----------------------------------------------------------
export const journeyButtonStyles = StyleSheet.create({
  // Style for an unselected journey button
  unselected: {
    borderRadius: 10,
    backgroundColor: "white",
    color: "black",
    padding: 10,
    width: "100%",
    marginTop: 10,
  },
  // Style for a selected journey button
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

// -----------------------------------------------------------
// Text Styles for Various Texts
// -----------------------------------------------------------
export const textStyles = StyleSheet.create({
  // Style for panel titles
  panelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  // Style for error text
  errorTextStyle: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  // Standard white text style
  whiteStandardStyle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  // Standard black text style
  blackStandardStyle: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
  },
  // Style for search input text
  searchStyle: {
    fontSize: 16,
    color: "gray",
  },
});

// -----------------------------------------------------------
// Styles for Custom Input Components
// -----------------------------------------------------------
export const customInputStyle = StyleSheet.create({
  // Style for a custom input field
  input: {
    borderWidth: 1,
    borderRadius: 10,
    width: "90%",
    marginTop: 10,
    borderColor: "grey",
    color: "white",
  },
  // Style for an invalid custom input field
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

// -----------------------------------------------------------
// Standard Button Styles (for generic buttons)
// -----------------------------------------------------------
export const standardButtonStyle = StyleSheet.create({
  flexDirection: "row",  // Arrange items in a row
  alignItems: "center",  // Center items vertically
  backgroundColor: "white",
  borderRadius: 10,
  padding: 15,
  marginBottom: 10,
  // Style for the icon inside the button
  icon: {
    paddingRight: 10,
  },
});

// -----------------------------------------------------------
// Styles for the User Icon Container
// -----------------------------------------------------------
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

// -----------------------------------------------------------
// Styles for Login/Logout Buttons
// -----------------------------------------------------------
export const logButtonStyle = StyleSheet.create({
  flexDirection: "row",       // Arrange in a row
  alignItems: "center",       // Center vertically
  justifyContent: "center",   // Center horizontally
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "white",
  paddingHorizontal: 20,
  paddingVertical: 10,
  marginHorizontal: 10,       // Spacing between buttons
  minWidth: 100,
  // Style for when the button is pressed
  pressed: {
    borderColor: "#ff6666",
  },
  // Color variant for login (not used in this file, but available)
  logInColor: {
    backgroundColor: "rgba(0, 255, 0, 0.1)",
  },
  // Color variant for logout (not used in this file, but available)
  logOutColor: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
  },
  // Cancel variant: used for a "Delete" or "Cancel" button
  cancel: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
  },
  // Submit variant: used for a "Save" or "Submit" button
  submit: {
    backgroundColor: "rgba(0, 255, 0, 0.1)",
  },
});
