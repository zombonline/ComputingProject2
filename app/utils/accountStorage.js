import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const ACCOUNTS_KEY = "accounts";

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

async function deleteItem(key) {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    return SecureStore.deleteItemAsync(key);
  }
}

// Add a new account
export async function addAccount(email, accountData) {
  let accounts = await getItem(ACCOUNTS_KEY);
  accounts = accounts ? JSON.parse(accounts) : {};

  if (accounts[email]) {
    return false; // Account already exists
  }

  accounts[email] = accountData;
  await setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  return true;
}

// Retrieve account by email
export async function getAccountByEmail(email) {
  let accounts = await getItem(ACCOUNTS_KEY);
  if (accounts) {
    accounts = JSON.parse(accounts);
    return accounts[email];
  }
  return null;
}

// Print all stored accounts (for debugging)
export async function printAccounts() {
  let accounts = await getItem(ACCOUNTS_KEY);
  if (accounts) {
    console.log("Stored accounts:", JSON.parse(accounts));
  } else {
    console.log("No accounts found in SecureStore.");
  }
}

// Remove all accounts (optional utility)
export async function removeAllAccounts() {
  await deleteItem(ACCOUNTS_KEY);
  console.log("All accounts have been removed.");
}
