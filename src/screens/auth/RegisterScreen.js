import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import HideEye from "../../components/buttons/HideEye";
import ShowEye from "../../components/buttons/ShowEye";
import CustomAlert from "../../components/CustomAlert";
import { MaterialIcons } from "@expo/vector-icons";
//import { BACKEND_API_ENDPOINT } from "@env";
import { useRoute } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { BASE_URL } from "../../constant/BaseConst";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

WebBrowser.maybeCompleteAuthSession();

const RegisterScreen = ({ navigation, setIsAuthenticated }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [alert, setAlert] = useState({ visible: false, type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const config = Platform.select({
    ios: {
      iosClientId:
        "648777206637-hguiupk76aio67enkivt3rubkmg7qfof.apps.googleusercontent.com",
      scopes: ["profile", "email"],
    },
    android: {
      androidClientId:
        "648777206637-ffiqpumuoecbqrmt2c7pv468oc8l07rt.apps.googleusercontent.com",
      scopes: ["profile", "email"],
    },
    default: {
      webClientId:
        " 648777206637-3v7v5978um0bgrc63eij8t0ab350deu0.apps.googleusercontent.com",
      scopes: ["profile", "email"],
    },
  });

  const [request, response, promptAsync] = Google.useAuthRequest(config);

  const handleRegister = async () => {
    //Email validation
    if (formData.email && !formData.email.includes("@")) {
      setAlert({
        visible: true,
        type: "warning",
        message: 'Email must contain "@" symbol.',
      });
      return;
    }

    //Check if all fields are filled
    if (
      !formData.firstName & !formData.lastName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.agreeToTerms
    ) {
      setAlert({
        visible: true,
        type: "warning",
        message:
          "Please fill out all fields and agree to the terms & conditions.",
      });
      return;
    }

    //Check if password is at least 6 characters long
    if (formData.password.length < 6) {
      setAlert({
        visible: true,
        type: "warning",
        message: "Password must be at least 6 characters long.",
      });
      return;
    }

    //Check if password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      setAlert({
        visible: true,
        type: "warning",
        message: "Passwords do not match.",
      });
      return;
    }

    const requestBody = {
      username: formData.firstName,
      email: formData.email,
      phone_number: formData.phoneNumber,
      first_name: formData.firstName,
      last_name: formData.lastName,
      password1: formData.password,
      password2: formData.confirmPassword,
    };

    //Send request to server
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/api/user/user-register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      console.log(response);
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setAlert({
          visible: true,
          type: "success",
          message: "Registration successful!",
        });
        setTimeout(() => navigation.navigate("Login"), 2000);
      } else {
        if (data.message_status === "warning" && data.detail) {
          setAlert({
            visible: true,
            type: "warning",
            message: data.detail, // Show the warning from the server response
          });
        } else {
          setAlert({
            visible: true,
            type: "error",
            message: data.message || "Registration failed!",
          });
        }
      }
    } catch (error) {
      setAlert({
        visible: true,
        type: "error",
        message: "Network error. Please try again.",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    //console.log(request);
    //console.log(response);

    if (response?.type === "success") {
      handleGoogleSignIn(response.authentication?.accessToken);
      console.log(response.authentication?.accessToken);
    }
  }, [response]);

  // Google sign in
  const handleGoogleSignIn = async (accessToken) => {
    try {
      setGoogleLoading(true);

      // Get user info from Google
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const userInfo = await response.json();

      //  await AsyncStorage.setItem("authToken", accessToken);
      if (userInfo) {
        await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
        setUser(userInfo);
      }

      console.log(userInfo);

      if (userInfo) {
        const backendResponse = await axios.post(
          `${BASE_URL}/api/user/google-login/`,
          {
            access_token: accessToken,
            user_type: "2",
            user_data: {
              email: userInfo.email,
              googleId: userInfo.id,
              name: userInfo.name,
            },
            google_loggedin_data: {
              userInfo: userInfo,
            },
          }
        );

        //const result = backendResponse.json();
        console.log(backendResponse.data);
        if (backendResponse.status === 200) {
          // console.log(backendResponse.data.key);
          if (backendResponse.data.key) {
            await AsyncStorage.multiRemove([
              // 'hasCompletedInterests',
              "email",
              "rememberMe",
            ]);
            await AsyncStorage.setItem("authToken", backendResponse.data.key);
            setIsAuthenticated(true);
          }
        }
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      setAlertType("error");
      setAlertMessage("Failed to sign in with Google. Please try again.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2700);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomAlert
        type={alert.type}
        message={alert.message}
        visible={alert.visible}
        onClose={() => setAlert({ ...alert, visible: false })}
      />

      {/* Center - Risus Logo */}
      <View style={styles.centerLogo}>
        <Text style={styles.logo}>Risus</Text>
        {/* <AdVisorLogo width={89} height={20} /> */}
      </View>
      <Text style={styles.title}>Create An Account To Get Started</Text>

      <View style={styles.nameContainer}>
        <TextInput
          placeholder="First Name"
          placeholderTextColor="#999999"
          value={formData.firstName}
          onChangeText={(text) => setFormData({ ...formData, firstName: text })}
          style={[styles.input, styles.halfInput, { color: "#000000" }]}
        />
        <TextInput
          placeholder="Last Name"
          placeholderTextColor="#999999"
          value={formData.lastName}
          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          style={[styles.input, styles.halfInput, { color: "#000000" }]}
        />
      </View>

      <TextInput
        placeholder="Email Address"
        keyboardType="email-address"
        placeholderTextColor="#999999"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        style={[styles.input, { color: "#000000" }]}
      />

      <TextInput
        placeholder="Phone Number"
        keyboardType="phone-pad"
        placeholderTextColor="#999999"
        value={formData.phoneNumber}
        onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
        style={[styles.input, { color: "#000000" }]}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={formData.password}
          placeholderTextColor="#999999"
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          style={[styles.input, styles.passwordInput, { color: "#000000" }]}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? <ShowEye /> : <HideEye />}
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#999999"
          secureTextEntry={!showPassword}
          value={formData.confirmPassword}
          onChangeText={(text) =>
            setFormData({ ...formData, confirmPassword: text })
          }
          style={[styles.input, styles.passwordInput, { color: "#000000" }]}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? <ShowEye /> : <HideEye />}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.termsContainer}
        onPress={() =>
          setFormData({ ...formData, agreeToTerms: !formData.agreeToTerms })
        }
      >
        <TouchableOpacity
          onPress={() =>
            setFormData({ ...formData, agreeToTerms: !formData.agreeToTerms })
          }
        >
          <View
            style={[styles.checkbox, formData.agreeToTerms && styles.checked]}
          >
            <MaterialIcons name="check-circle" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.termsText}>Agree with terms & condition</Text>
      </TouchableOpacity>

      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={[styles.signUpButton, isLoading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#000000" size="small" />
              <Text style={[styles.signUpButtonText, { marginLeft: 8 }]}>
                Signing up...
              </Text>
            </View>
          ) : (
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.orText}>Or Sign Up With</Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={[styles.socialButton, googleLoading && styles.disabledButton]}
          onPress={() => promptAsync()}
          disabled={googleLoading}
        >
          <View style={styles.socialButtonContent}>
            <Image
              source={require("../../assets/icons/google.png")}
              style={styles.socialIcon}
            />
            {googleLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#000000" size="small" />
                <Text style={[styles.socialButtonText, { marginLeft: 8 }]}>
                  Connecting...
                </Text>
              </View>
            ) : (
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            )}
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../../assets/icons/apple.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../../assets/icons/facebook.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../../assets/icons/linkedin.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity> */}
      </View>

      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.signInLink}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 24,
  },
  logo: {
    fontSize: 45,
    fontFamily: "Briem-Medium",
    color: "#7DC8FF",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    color: "#000",
    fontFamily: "Figtree-Bold",
    marginBottom: 32,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    marginBottom: 16,
    fontSize: 16,
    paddingVertical: 8,
    fontFamily: "Figtree-Regular",
  },
  halfInput: {
    width: "48%",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    height: 48,
    borderBottomWidth: 0,
    marginBottom: 0,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 100,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#58AFFF",
  },
  termsText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "Figtree-Regular",
  },
  signUpButton: {
    backgroundColor: "#CEEAFF",
    paddingVertical: 12,
    borderRadius: 100,
    width: "70%",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 25,
  },
  signUpButtonText: {
    textAlign: "center",
    fontSize: 18,
    color: "#000000",
    fontFamily: "Figtree-Bold",
  },
  orText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 24,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  socialButton: {
    backgroundColor: "#ffffff",
    borderRadius: 100,
    width: "80%",
    height: 48,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    marginBottom: 10,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    color: "#3C4043",
    fontFamily: "Figtree-Medium",
    letterSpacing: 0.25,
  },
  disabledButton: {
    opacity: 0.7,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signInText: {
    color: "#666",
    fontSize: 14,
  },
  signInLink: {
    color: "#58AFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  socialButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});
