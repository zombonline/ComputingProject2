import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const DATA_KEY = "userData";

// Fallback functions for web using localStorage
async function getItem(key) {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else {
    return SecureStore.getItemAsync(key);
  }
}

async function setItem(key, value) {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    return SecureStore.setItemAsync(key, value);
  }
}

// Store user data locally (excluding password)
export async function saveUserDataLocally(userData) {
  const { password, ...dataWithoutPassword } = userData; // Exclude password
  await setItem(DATA_KEY, JSON.stringify(dataWithoutPassword));
}

// Retrieve stored user data
export async function getLocalUserData() {
  const data = await getItem(DATA_KEY);
  return data ? JSON.parse(data) : null;
}

// Remove local user data
export async function clearLocalUserData() {
  await setItem(DATA_KEY, "");
}
