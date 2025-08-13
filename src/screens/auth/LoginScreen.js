// src/screens/LoginScreen.js

import React, { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import HideEye from "../../components/buttons/HideEye";
import ShowEye from "../../components/buttons/ShowEye";
import CustomAlert from "../../components/CustomAlert";
//import iconSet from "@expo/vector-icons/build/Fontisto";
//import { BACKEND_API_ENDPOINT } from "@env";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { BASE_URL } from "../../constant/BaseConst";
import * as Linking from "expo-linking";
import { makeRedirectUri } from "expo-auth-session";

const { height } = Dimensions.get("window");

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ setIsAuthenticated }) => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [user, setUser] = useState(null);
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
        "648777206637-3v7v5978um0bgrc63eij8t0ab350deu0.apps.googleusercontent.com",
      scopes: ["profile", "email"],
    },
  });

  const config2 = {
    expoClientId:
      "648777206637-3v7v5978um0bgrc63eij8t0ab350deu0.apps.googleusercontent.com",
    iosClientId:
      "648777206637-hguiupk76aio67enkivt3rubkmg7qfof.apps.googleusercontent.com",
    androidClientId:
      "648777206637-ffiqpumuoecbqrmt2c7pv468oc8l07rt.apps.googleusercontent.com",
    redirectUri: makeRedirectUri({
      scheme: "com.advisor.release",
      path: "oauthredirect",
    }),
    scopes: ["profile", "email"],
    responseType: "token",
  };

  const [request, response, promptAsync] = Google.useAuthRequest(config);

  useEffect(() => {
    const getRememberedUser = async () => {
      try {
        const rememberedEmail = await AsyncStorage.getItem("email");
        const rememberedPassword = await AsyncStorage.getItem("password");
        const remembered = await AsyncStorage.getItem("rememberMe");

        if (remembered === "true") {
          setEmail(rememberedEmail || "");
          setPassword(rememberedPassword || "");
          setRememberMe(true);
        }
      } catch (error) {
        console.error("Failed to load user data from AsyncStorage:", error);
      }
    };
    const getLoggedInFirstTime = async () => {
      const hasCompletedInterests = await AsyncStorage.getItem(
        "hasCompletedInterests"
      );
      console.log(hasCompletedInterests);
    };

    getLoggedInFirstTime();

    getRememberedUser();
  }, []);

  useEffect(() => {
    console.log("Google Auth Request Object:", request);
    console.log("Google Auth Response:", response);

    if (response?.type === "success") {
      handleGoogleSignIn(response.authentication?.accessToken);
      console.log(response.authentication?.accessToken);
    }
  }, [response]);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setAlertType("warning");
        setAlertMessage("Email and Password are required!");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2700);
        return;
      }

      setIsLoading(true);

      const response = await axios.post(`${BASE_URL}/api/user/obtain-token/`, {
        email,
        password,
      });

      if (response.status === 200) {
        try {
          // First clear all existing data
          await AsyncStorage.multiRemove(["email", "rememberMe"]);

          // Then set new auth data
          await AsyncStorage.setItem("authToken", response.data.key);

          const loggedInFirstTime =
            response.data.logged_in_first_time?.toString() || "false";

          await AsyncStorage.setItem(
            "hasCompletedInterests",
            loggedInFirstTime
          );

          if (rememberMe) {
            await AsyncStorage.setItem("email", email);
            await AsyncStorage.setItem("rememberMe", "true");
          }

          // Only set authenticated after everything succeeded
          setIsAuthenticated(true);
        } catch (storageError) {
          console.error("AsyncStorage error:", storageError);
          setAlertType("error");
          setAlertMessage("Error saving login data. Please try again.");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2700);
        }
      }
    } catch (error) {
      // Simplified error handling
      let errorMessage =
        "Login failed. Please check your credentials and try again.";

      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.non_field_errors?.length > 0) {
        errorMessage = error.response.data.non_field_errors[0];
      }

      setAlertType("error");
      setAlertMessage(errorMessage);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2700);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  // Google sign in
  const handleGoogleSignIn = async (accessToken) => {
    console.log(accessToken);
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "0"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.centerLogo}>
                                <Text style={styles.logo}>Risus</Text>
                                {/* <AdVisorLogo width={89} height={20} /> */}
                              </View>

            <View style={styles.formContainer}>
              <Text style={styles.loginText}>LOGIN</Text>

              <TextInput
                style={[styles.input, { color: '#000000' }]}
                placeholder="Email"
                placeholderTextColor="#999999"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, { color: '#000000' }]}
                  placeholder="Password"
                  placeholderTextColor="#999999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? <ShowEye /> : <HideEye />}
                </TouchableOpacity>
              </View>

              <View style={styles.rememberContainer}>
                <TouchableOpacity
                  style={styles.rememberMe}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checked]}>
                    <MaterialIcons name="check-circle" size={16} color="#fff" />
                  </View>
                  <Text style={styles.rememberText}>Remember me</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                  onPress={handleLogin}
                  style={[
                    styles.loginButton,
                    isLoading && styles.disabledButton,
                  ]}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator color="#000000" size="small" />
                      <Text style={[styles.loginButtonText, { marginLeft: 8 }]}>
                        Logging in...
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.loginButtonText}>Log In</Text>
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.orContainer}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>Or Log In With</Text>
                <View style={styles.orLine} />
              </View>
              {/* Google sign in button */}
              <View style={styles.socialContainer}>
                <TouchableOpacity
                  style={[
                    styles.socialButton,
                    googleLoading && styles.disabledButton,
                  ]}
                  onPress={() => promptAsync()}
                  disabled={googleLoading}
                >
                  <View style={styles.socialButtonContent}>
                    <Image
                      source={require("../../assets/icons/google.png")}
                      style={styles.socialIcon}
                    />
                    <Text style={styles.socialButtonText}>
                      {googleLoading ? "Signing in..." : "Continue with Google"}
                    </Text>
                  </View>
                </TouchableOpacity>
                {/* {user && (
                  <>
                    <Text>{user.email}</Text>
                    <Text>{user.name}</Text>
                  </>
                )} */}
              </View>
              {/* <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source={require("../../assets/icons/google.png")}
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
                    source={require("../../assets/icons/apple.png")}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source={require("../../assets/icons/linkedin.png")}
                    style={styles.socialIcon}
                  />
                </TouchableOpacity>
              </View> */}

              <View style={styles.registerContainer}>
                <Text style={styles.noAccountText}>
                  Don't have an account?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text style={styles.registerLink}>Register now for free</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Custom Alert */}
          {showAlert && (
            <CustomAlert
              type={alertType}
              message={alertMessage}
              visible={showAlert}
              onClose={handleCloseAlert}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  logo: {
    fontSize: 45,
    fontFamily: "Briem-Medium",
    color: "#7DC8FF",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  formContainer: {
    paddingHorizontal: 15,
  },
  loginText: {
    fontSize: 28,
    marginBottom: 40,
    textAlign: "center",
    fontFamily: "Figtree-Medium",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    paddingVertical: 10,
    marginBottom: 25,
    fontSize: 17,
    fontFamily: "Figtree-Regular",
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 20,
  },
  eyeIcon: {
    position: "absolute",
    right: 0,
    top: 3,
  },
  rememberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "#7DC8FF",
  },
  rememberText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Figtree-Regular",
  },
  forgotText: {
    fontSize: 16,
    paddingVertical: 2,
    color: "#7DC8FF",
    fontFamily: "Figtree-Medium",
  },
  loginButton: {
    backgroundColor: "#CEEAFF",
    padding: 12,
    borderRadius: 100,
    width: "80%",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 25,
  },
  loginButtonText: {
    textAlign: "center",
    fontSize: 18,
    color: "#000000`",
    fontFamily: "Figtree-Bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#b8b8b8",
  },
  orText: {
    paddingHorizontal: 16,
    color: "#666",
    fontSize: 16,
    fontFamily: "Figtree-Regular",
  },
  socialContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  socialButton: {
    backgroundColor: "#ffffff",
    borderRadius: 100,
    width: "100%",
    height: 48,
    // elevation: 3,
    // shadowColor: "#000000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#E3E3E3",
  },
  socialButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
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
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  noAccountText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Figtree-Regular",
  },
  registerLink: {
    fontSize: 16,
    color: "#7DC8FF",
    fontFamily: "Figtree-Medium",
  },
  disabledButton: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoginScreen;
