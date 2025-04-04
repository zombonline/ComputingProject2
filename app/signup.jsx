import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
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
import {
  saveUserDataLocally,
  getLocalUserData,
} from "@/app/utils/accountStorage";
import { Loginsignup } from "./style";

const { width: screenWidth } = Dimensions.get("window");
const computedInputWidth = screenWidth < 500 ? screenWidth * 0.7 : screenWidth * 0.25;
const buttonWidth = 150;

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
        // Handle local anonymous user if needed.
      }
    };
    fetchAnonymousUser();
  }, []);

  const validateUsername = (text) => {
    if (text.length < 3) return "Username must be at least 3 characters long.";
    return null;
  };

  const formatUsername = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const validatePhoneNumber = (text) => {
    if (!/^[0-9]{11}$/.test(text))
      return "Phone number must have exactly 11 digits.";
    if (!text.startsWith("0")) return "Phone number must start with 0.";
    return null;
  };

  const validateEmail = (text) => {
    if (!/\S+@\S+\.\S+/.test(text)) return "Invalid email format.";
    return null;
  };

  const validatePassword = (text) => {
    if (text.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(text))
      return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(text))
      return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(text))
      return "Password must contain at least one number.";
    if (!/[^A-Za-z0-9]/.test(text))
      return "Password must contain at least one special character.";
    return null;
  };

  const validateConfirmPassword = (text) => {
    if (text !== password) return "Passwords do not match.";
    return null;
  };

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

    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      if (auth.currentUser && auth.currentUser.isAnonymous) {
        const credential = EmailAuthProvider.credential(email, password);
        const linkedUser = await linkWithCredential(
          auth.currentUser,
          credential
        );

        await updateProfile(linkedUser.user, {
          displayName: formatUsername(username),
        });

        const userData = {
          uid: linkedUser.user.uid,
          email,
          username: formatUsername(username),
          phoneNumber,
          createdAt: new Date(),
        };
        await setDoc(doc(db, "users", linkedUser.user.uid), userData, {
          merge: true,
        });

        await saveUserDataLocally(userData);
        router.replace("/login");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
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
    <View style={Loginsignup.container}>
      <TouchableOpacity onPress={() => router.back()} style={Loginsignup.backArrow}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={{...Loginsignup.headerText, paddingTop:150, paddingBottom:30}}>Sign Up</Text>

      <TextInput
        placeholder="Username"
        placeholderTextColor="#777"
        style={[Loginsignup.input, { color: "#fff" }]}
        value={username}
        onChangeText={(text) => {
          setUsername(formatUsername(text));
          setErrors((prev) => ({ ...prev, username: validateUsername(text) }));
        }}
        autoCapitalize="none"
      />
      {errors.username && (
        <Text style={Loginsignup.errorText}>{errors.username}</Text>
      )}

      <TextInput
        placeholder="Email"
        placeholderTextColor="#777"
        style={[Loginsignup.input, { color: "#fff" }]}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors((prev) => ({ ...prev, email: validateEmail(text) }));
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={Loginsignup.errorText}>{errors.email}</Text>}

      <TextInput
        placeholder="Phone Number"
        placeholderTextColor="#777"
        style={[Loginsignup.input, { width: computedInputWidth,color: "#fff" }]}
        value={phoneNumber}
        onChangeText={(text) => {
          setPhoneNumber(text);
          setErrors((prev) => ({
            ...prev,
            phoneNumber: validatePhoneNumber(text),
          }));
        }}
        keyboardType="phone-pad"
      />
      {errors.phoneNumber && (
        <Text style={Loginsignup.errorText}>{errors.phoneNumber}</Text>
      )}

      <TextInput
        placeholder="Password"
        placeholderTextColor="#777"
        secureTextEntry
        style={[Loginsignup.input, { width: computedInputWidth , color: "#fff"}]}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrors((prev) => ({ ...prev, password: validatePassword(text) }));
        }}
      />
      {errors.password && (
        <Text style={Loginsignup.errorText}>{errors.password}</Text>
      )}

      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#777"
        secureTextEntry
        style={[Loginsignup.input, { width: computedInputWidth, color: "#fff" }]}
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setErrors((prev) => ({
            ...prev,
            confirmPassword: validateConfirmPassword(text),
          }));
        }}
      />
      {errors.confirmPassword && (
        <Text style={Loginsignup.errorText}>{errors.confirmPassword}</Text>
      )}

      {errors.general && <Text style={Loginsignup.errorText}>{errors.general}</Text>}

      <TouchableOpacity
        style={[Loginsignup.button, !isFormValid() && Loginsignup.disabledButton]}
        onPress={handleSignUp}
        disabled={!isFormValid()}
      >
        <Icon name="person-add" size={20} color="#fff" />
        <Text style={Loginsignup.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}