import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import {
  auth,
  db,
  doc,
  setDoc,
  createUserWithEmailAndPassword,
} from "@/app/utils/firebaseConfig";
import {
  updateProfile,
  linkWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { saveUserDataLocally, getLocalUserData } from "@/app/utils/accountStorage";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAnonymousUser = async () => {
      const localUser = await getLocalUserData();
      if (localUser && localUser.uid) {
      }
    };
    fetchAnonymousUser();
  }, []);

  // Validaciones
  const validateUsername = (text) => {
    if (text.length < 3) return "Username must be at least 3 characters long.";
    return null;
  };

  const formatUsername = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const validatePhoneNumber = (text) => {
    if (!/^[0-9]{11}$/.test(text)) return "Phone number must have exactly 11 digits.";
    if (!text.startsWith("0")) return "Phone number must start with 0.";
    return null;
  };

  const validateEmail = (text) => {
    if (!/\S+@\S+\.\S+/.test(text)) return "Invalid email format.";
    return null;
  };

  const validatePassword = (text) => {
    if (text.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(text)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(text)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(text)) return "Password must contain at least one number.";
    if (!/[^A-Za-z0-9]/.test(text)) return "Password must contain at least one special character.";
    return null;
  };

  const validateConfirmPassword = (text) => {
    if (text !== password) return "Passwords do not match.";
    return null;
  };

  // 🔹 Verifica si hay errores activos
  const isFormValid = () => {
    return (
      username.length >= 3 &&
      !validateUsername(username) &&
      !validatePhoneNumber(phoneNumber) &&
      !validateEmail(email) &&
      !validatePassword(password) &&
      !validateConfirmPassword(confirmPassword)
    );
  };

  const handleSignUp = async () => {
    let newErrors = {};

    newErrors.username = validateUsername(username);
    newErrors.phoneNumber = validatePhoneNumber(phoneNumber);
    newErrors.email = validateEmail(email);
    newErrors.password = validatePassword(password);
    newErrors.confirmPassword = validateConfirmPassword(confirmPassword);

    // Filtrar errores (eliminar claves sin errores)
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      if (auth.currentUser && auth.currentUser.isAnonymous) {
        const credential = EmailAuthProvider.credential(email, password);
        const linkedUser = await linkWithCredential(auth.currentUser, credential);

        await updateProfile(linkedUser.user, { displayName: formatUsername(username) });

        const userData = {
          uid: linkedUser.user.uid,
          email,
          username: formatUsername(username),
          phoneNumber,
          createdAt: new Date(),
        };
        await setDoc(doc(db, "users", linkedUser.user.uid), userData, { merge: true });

        await saveUserDataLocally(userData);
        router.replace("/login");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userData = {
          uid: user.uid,
          email,
          username: formatUsername(username),
          phoneNumber,
          createdAt: new Date(),
        };
        await setDoc(doc(db, "users", user.uid), userData);
        await saveUserDataLocally(userData);

        router.replace("/home");
      }
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backArrow}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.headerText}>Sign Up</Text>

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={(text) => {
          setUsername(formatUsername(text));
          setErrors((prev) => ({ ...prev, username: validateUsername(text) }));
        }}
        autoCapitalize="none"
      />
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors((prev) => ({ ...prev, email: validateEmail(text) }));
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        value={phoneNumber}
        onChangeText={(text) => {
          setPhoneNumber(text);
          setErrors((prev) => ({ ...prev, phoneNumber: validatePhoneNumber(text) }));
        }}
        keyboardType="phone-pad"
      />
      {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrors((prev) => ({ ...prev, password: validatePassword(text) }));
        }}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(text) }));
        }}
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

      {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}

      <TouchableOpacity
        style={[styles.button, !isFormValid() && styles.disabledButton]}
        onPress={handleSignUp}
        disabled={!isFormValid()}
      >
        <Icon name="person-add" size={20} color="#fff" />
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: "#fff", alignItems: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, fontSize: 16, marginBottom: 5, width: "90%" },
  errorText: { color: "red", fontSize: 14, marginBottom: 10 },
  button: { flexDirection: "row", alignItems: "center", backgroundColor: "#007AFF", paddingVertical: 12, borderRadius: 5, width: 150, justifyContent: "center" },
  disabledButton: { backgroundColor: "#ccc" },
});