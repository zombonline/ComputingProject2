import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { auth, signInWithEmailAndPassword } from "@/app/utils/firebaseConfig";
import { getLocalUserData } from "@/app/utils/accountStorage";
import CommutyIcon from "@/assets/images/logo.png";
import { Loginsignup } from "./style";

const { width: screenWidth } = Dimensions.get("window");
const computedInputWidth = screenWidth < 500 ? screenWidth * 0.7 : screenWidth * 0.25;
const logoSize = screenWidth * 0.25;
const buttonWidth = 140;

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const localData = await getLocalUserData();
      if (localData) {
        console.log("📂 Datos locales encontrados:", localData);
        setUserData(localData);
      } else {
        console.log("⚠️ No se encontraron datos locales.");
      }
    };
    loadUserData();
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }

    console.log("🔄 Intentando iniciar sesión con:", email, password);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Inicio de sesión exitoso:", userCredential.user);
      Alert.alert("Success", "Login successful!");
      router.replace("/home");
    } catch (error) {
      console.error("❌ Error en el login:", error);
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
          style={[Loginsignup.input, { width: computedInputWidth }]}
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={[Loginsignup.input, { width: computedInputWidth }]}
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
        <Text style={Loginsignup.signUpText}>Don't you have an account? </Text>
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


