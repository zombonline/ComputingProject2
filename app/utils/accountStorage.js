// accountStorage.js (Merged Commute and User Data Storage)
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { db, auth } from "./firebaseConfig";
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";

const DATA_KEY = "userData";
const COMMUTE_STORAGE_KEY = "commutes";

// Helper functions for storing data
/**
 * Retrieves an item from SecureStore.
 * @param {string} key - The key of the item to retrieve.
 * @returns {Promise<string|null>} - The stored value or null if not found.
 */
async function getItem(key) {
  return SecureStore.getItemAsync(key);
}

/**
 * Stores an item in SecureStore.
 * @param {string} key - The key under which to store the value.
 * @param {string} value - The value to store.
 */
async function setItem(key, value) {
  return SecureStore.setItemAsync(key, value);
}

// User Data Storage
/**
 * Saves user data locally, excluding the password.
 * @param {Object} userData - The user data to store.
 */
export async function saveUserDataLocally(userData) {
  const { password, ...dataWithoutPassword } = userData; // Exclude password
  await setItem(DATA_KEY, JSON.stringify(dataWithoutPassword));
}

/**
 * Retrieves the stored user data.
 * @returns {Promise<Object|null>} - The stored user data or null if not found.
 */
export async function getLocalUserData() {
  const data = await getItem(DATA_KEY);
  return data ? JSON.parse(data) : null;
}

/**
 * Clears the stored user data.
 */
export async function clearLocalUserData() {
  await setItem(DATA_KEY, "");
}

// Commute Storage (SecureStore)
/**
 * Saves a commute to SecureStore.
 * @param {Object} commute - The commute object, expected to have a unique commuteId.
 */
export const saveCommute = async (commute) => {
  try {
    const storedCommutes = await getItem(COMMUTE_STORAGE_KEY);
    const commutes = storedCommutes ? JSON.parse(storedCommutes) : {};
    commutes[commute.commuteId] = commute;
    await setItem(COMMUTE_STORAGE_KEY, JSON.stringify(commutes));
  } catch (error) {
    console.error("Error saving commute:", error);
  }
};

/**
 * Retrieves all saved commutes from SecureStore.
 * @returns {Promise<Object>} - A dictionary of commute data.
 */
export const getCommutes = async () => {
  try {
    const storedCommutes = await getItem(COMMUTE_STORAGE_KEY);
    return storedCommutes ? JSON.parse(storedCommutes) : {};
  } catch (error) {
    console.error("Error retrieving commutes:", error);
    return {};
  }
};

/**
 * Removes a specific commute from SecureStore.
 * @param {string} commuteId - The unique ID of the commute to remove.
 */
export const removeCommute = async (commuteId) => {
  try {
    const storedCommutes = await getItem(COMMUTE_STORAGE_KEY);
    if (!storedCommutes) return;
    const commutes = JSON.parse(storedCommutes);
    delete commutes[commuteId];
    await setItem(COMMUTE_STORAGE_KEY, JSON.stringify(commutes));
  } catch (error) {
    console.error("Error removing commute:", error);
  }
};

// Commute Storage (Firebase)
/**
 * Saves a commute to Firestore.
 * @param {Object} commute - The commute object, expected to have a unique commuteId.
 */
export const saveCommuteToFirestore = async (commute) => {
  try {
    if (!auth.currentUser) throw new Error("No authenticated user");
    if (typeof commute !== "object" || commute === null) throw new Error("Invalid commute data");
    if (!commute.commuteId) throw new Error("Missing commuteId");

    const userDocRef = doc(db, "users", auth.currentUser.uid, "commutes", commute.commuteId);

    // Remove undefined values from the object
    const cleanCommute = Object.fromEntries(
      Object.entries(commute).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(cleanCommute).length === 0) throw new Error("No valid data to save");

    await setDoc(userDocRef, cleanCommute);

    console.log("Commute saved successfully!");
  } catch (error) {
    console.error("Error saving commute to Firestore:", error);
  }
};

/**
 * Retrieves all saved commutes from Firestore.
 * @returns {Promise<Object>} - A dictionary of commute data.
 */
export const getCommutesFromFirestore = async () => {
  try {
    if (!auth.currentUser) throw new Error("No authenticated user");
    const commutesCollectionRef = collection(db, "users", auth.currentUser.uid, "commutes");
    const querySnapshot = await getDocs(commutesCollectionRef);

    const commutes = {};
    querySnapshot.forEach((doc) => {
      commutes[doc.id] = doc.data();
    });

    return commutes;
  } catch (error) {
    console.error("Error retrieving commutes from Firestore:", error);
    return {};
  }
};
/**
 * Retrieves a specific commute from Firestore.
 * @param {string} commuteId - The unique ID of the commute to retrieve.
 * @returns {Promise<Object|null>} - The commute data or null if not found.
 */
export const getCommuteFromFirestore = async (commuteId) => {
  try {
    if (!auth.currentUser) throw new Error("No authenticated user");
    const userDocRef = doc(db, "users", auth.currentUser.uid, "commutes", commuteId);
    const docSnap = await getDoc(userDocRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error retrieving commute from Firestore:", error);
    return null;
  }
};
//removes the commute object from commutes collection in firestore
export const removeCommuteFromFirestore = async (commuteId) => {
  try {
    if (!auth.currentUser) throw new Error("No authenticated user");
    const userCollection = collection(db, "users", auth.currentUser.uid, "commutes");
    //remove doc from commutes collection
    const userDocRef = doc(userCollection, commuteId);
    await deleteDoc(userDocRef);
    console.log("Commute removed successfully!");
  } catch (error) {
    console.error("Error removing commute from Firestore:", error);
  }
}
