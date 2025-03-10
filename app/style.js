import { StyleSheet, Platform } from "react-native";

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    margin: 10,
    marginHorizontal: 20,
    alignItems: "center",
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    zIndex: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
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
  settingsPanel: {
    backgroundColor: "#33333E",
    borderRadius: 10,
    padding: 20,
    margin: 20,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
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
  container: { flex: 1, backgroundColor: "#F0F0F0" },
  header: { fontSize: 24, fontWeight: "bold", padding: 20 },

  searchContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  searchIcon: { marginRight: 10 },
  searchText: { fontSize: 16, color: "gray" },

  settingsPanel: {
    backgroundColor: "#33333e",
    borderRadius: 10,
    padding: 20,
    margin: 20,
    top: 450,
  },
  panelTitle: { fontSize: 18, fontWeight: "bold", color: "black", marginBottom: 10 },

  settingButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  icon: { marginRight: 10 },
  optionText: { fontSize: 16 },

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

// Styles for `[setting].jsx`
export const subSettingStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F0F0", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },

  searchContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 20,
  },
  searchIcon: { marginRight: 10 },
  searchText: { fontSize: 16, color: "gray" },

  settingsPanel: {
    backgroundColor: "#ddd",
    borderRadius: 10,
    padding: 20,
  },
  panelTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },

  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  optionText: { fontSize: 16 },

  errorText: { fontSize: 18, color: "red", textAlign: "center", marginTop: 20 },
});

// Styles for commuteTestScreen.tsx
export const commuteTestStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", //flex-end
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#33333E",
  },
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
  searchBarContainer: {
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
  searchIcon: commonStyles.searchIcon,
  searchInput: commonStyles.searchInput,
  // Dark bottom card containing user information
  bottomSection: {
    position: "absolute",
    bottom: 70,
    width: "100%",
    backgroundColor: "#2C2C2E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  chevronUp: {
    marginBottom: 5,
  },
  profileTitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
    fontWeight: "bold",
  },
  userIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
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
  },
  settingsIcon: {
    marginRight: 8,
  },
  accountSettingsText: {
    fontSize: 16,
    color: "#fff",
  },
  loginRow: {
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
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
