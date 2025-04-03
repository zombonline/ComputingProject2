import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { auth, signInWithEmailAndPassword } from "@/app/utils/firebaseConfig";
import { getLocalUserData } from "@/app/utils/accountStorage";

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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("✅ Inicio de sesión exitoso:", userCredential.user);

      Alert.alert("Success", "Login successful!");
      router.replace("/home");
    } catch (error) {
      console.error("❌ Error en el login:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Login</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Icon name="login" size={20} color="#fff" />
        <Text style={styles.signInText}>Sign in</Text>
      </TouchableOpacity>

      {/* Agregar la pregunta "Don't you have an account?" */}
      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.signupText}>
          Don't you have an account?{" "}
          <Text style={styles.linkText}>Sign up</Text>
        </Text>
      </TouchableOpacity>

      {userData && (
        <Text style={styles.localDataText}>
          Using anonymous account: {userData.uid}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
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
  localDataText: { marginTop: 20, color: "#777", fontSize: 14 },
});
