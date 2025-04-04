import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getLocalUserData } from "@/app/utils/accountStorage";
import CommutyIcon from "@/assets/images/logo.png";
import { Loginsignup } from "./style";

const { width: screenWidth } = Dimensions.get("window");
const computedInputWidth = screenWidth < 500 ? screenWidth * 0.7 : screenWidth * 0.25;
const buttonWidth = 140;

/** 
 * Login component for user authentication.
 * It allows users to enter their email and password to log in.
 * If the user is already logged in, it retrieves their data from local storage.
 * It also provides a link to the signup page for new users. 
 * @returns {JSX.Element} The rendered Login component.
 */
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const localData = await getLocalUserData();
      if (localData) {
        setUserData(localData);
      } 
    };
    loadUserData();
  }, []);

  /**
   * Handles the sign-in process.
   * Validates the input fields and simulates a login process.
   * If successful, navigates to the home page.
   * If there's an error, it displays an alert with the error message.
   * @returns {Promise<void>}
   */
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
    try {
      Alert.alert("Success", "Login successful!");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{...Loginsignup.container,paddingTop: 150,}}>
      <TouchableOpacity onPress={() => router.back()} style={Loginsignup.backArrow}>
              <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      {/* Logo Section */}
      <View style={Loginsignup.logoContainer}>
        <Image source={CommutyIcon} style={Loginsignup.logo} resizeMode="contain" />
      </View>

      {/* Login Header */}
      <View style={Loginsignup.loginContainer}>
        <Text style={Loginsignup.loginText}>Login</Text>
      </View>

      {/* Input Fields */}
      <View style={{...Loginsignup.inputGroup, paddingTop: 50}}>
        <TextInput
          placeholder="Email"
          style={[Loginsignup.input, { width: computedInputWidth}]}
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={[Loginsignup.input, { width: computedInputWidth}]}
          placeholderTextColor="#777"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Sign In Button */}
      <View style={Loginsignup.buttonContainer}>
        <TouchableOpacity style={[Loginsignup.button, { width: buttonWidth }]} onPress={handleSignIn}>
          <Icon name="login" size={20} color="#fff" />
          <Text style={Loginsignup.buttonText}>Sign in</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Link to Sign Up */}
      <View style={Loginsignup.linkContainer}>
        <Text style={Loginsignup.signUpText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={Loginsignup.linkText}>Sign up</Text>
        </TouchableOpacity>
      </View>

      {userData && (
        <Text style={Loginsignup.localDataText}>
          Using anonymous account: {userData.uid}
        </Text>
      )}
    </View>
  );
}


