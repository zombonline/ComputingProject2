import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";  // <-- expo-router

import CommutyIcon from "@/assets/images/Commuty-Icon-BIG.png";
import { addAccount, printAccounts } from "@/app/utils/accountStorage";

const { width: screenWidth } = Dimensions.get("window");
const computedInputWidth = screenWidth < 500 ? screenWidth * 0.9 : screenWidth * 0.25;
const logoSize = screenWidth * 0.25;
const buttonWidth = 150;

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Generate salt
  const generateSalt = async () => {
    const randomBytes = await Crypto.getRandomBytesAsync(16);
    return Array.from(randomBytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  };

  // Hash password with salt
  const hashPassword = async (password, salt) => {
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      salt + password
    );
    return hash;
  };

  const handleSignUp = async () => {
    if (!email || !username || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    const salt = await generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    const accountData = { email, username, password: hashedPassword, salt };
    const success = await addAccount(email, accountData);

    if (success) {
      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: async () => {
            // For debugging
            await printAccounts();
            // Return to the login screen
            router.replace("/login");
          },
        },
      ]);
    } else {
      Alert.alert("Sign Up Failed", "An account with that email already exists.");
    }
  };

  return (
    <View style={styles.container}>
      {/* OPTIONAL BACK ARROW */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backArrow}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={CommutyIcon} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Sign Up</Text>
      </View>

      {/* Inputs */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          style={[styles.input, { width: computedInputWidth }]}
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Username"
          style={[styles.input, { width: computedInputWidth }]}
          placeholderTextColor="#777"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={[styles.input, { width: computedInputWidth }]}
          placeholderTextColor="#777"
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          style={[styles.input, { width: computedInputWidth }]}
          placeholderTextColor="#777"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* Sign Up Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { width: buttonWidth }]}
          onPress={handleSignUp}
        >
          <Icon name="person-add" size={20} color="#fff" />
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  backArrow: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 999,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: logoSize,
    height: logoSize,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  inputContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
