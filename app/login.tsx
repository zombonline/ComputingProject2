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
import { useRouter } from "expo-router";          // <-- expo-router
import Icon from "react-native-vector-icons/MaterialIcons";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";

import CommutyIcon from "@/assets/images/Commuty-Icon-BIG.png";
import { getAccountByEmail } from "@/app/utils/accountStorage"; // your local utility

const { width: screenWidth } = Dimensions.get("window");
const computedInputWidth = screenWidth < 500 ? screenWidth * 0.9 : screenWidth * 0.25;
const logoSize = screenWidth * 0.25;
const buttonWidth = 150;

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }

    const account = await getAccountByEmail(email);
    if (!account) {
      Alert.alert("Error", "No account found with that email.");
      return;
    }

    // Compare password
    const storedHashedPassword = account.password;
    const salt = account.salt;
    const computedHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      salt + password
    );

    if (computedHash !== storedHashedPassword) {
      Alert.alert("Error", "Incorrect password.");
      return;
    }

    // Success
    await SecureStore.setItemAsync("userToken", email);
    Alert.alert("Success", "Login successful!");
    // Navigate to profile
    router.replace("/profile");
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity
        style={styles.backArrow}
        onPress={() => router.push("/profile")}
      >
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={CommutyIcon} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Title */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Login</Text>
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
          placeholder="Password"
          secureTextEntry
          style={[styles.input, { width: computedInputWidth }]}
          placeholderTextColor="#777"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Sign In Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.signInButton, { width: buttonWidth }]}
          onPress={handleSignIn}
        >
          <Icon name="login" size={20} color="#fff" />
          <Text style={styles.signInText}>Sign in</Text>
        </TouchableOpacity>
      </View>

      {/* Go to Sign Up */}
      <View style={styles.signUpLinkContainer}>
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={[styles.signUpText, styles.linkText]}>
            Create an account
          </Text>
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
    alignItems: "center",
  },
  backArrow: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 10,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: logoSize,
    height: logoSize,
  },
  loginContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
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
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 5,
  },
  signInText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  signUpLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signUpText: {
    fontSize: 16,
    color: "#000",
  },
  linkText: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});
