import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import ShowEye from "../../components/buttons/ShowEye";
import HideEye from "../../components/buttons/HideEye";
import CustomAlert from "../../components/CustomAlert";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "../../constant/BaseConst";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRequirementsVisible, setIsRequirementsVisible] = useState(false);

  // Animation refs for input focus
  const currentLineAnim = useRef(new Animated.Value(0)).current;
  const newLineAnim = useRef(new Animated.Value(0)).current;
  const confirmLineAnim = useRef(new Animated.Value(0)).current;

  // Password visibility states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  // Alert state
  const [alert, setAlert] = useState({
    visible: false,
    type: "",
    message: "",
  });

  const animateLine = (animation, toValue) => {
    Animated.timing(animation, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const showAlert = (type, message) => {
    setAlert({
      visible: true,
      type,
      message,
    });
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < 6) {
      showAlert("warning", "Password must be at least 8 characters long");
      return false;
    }
    // if (!hasUpperCase || !hasLowerCase) {
    //   showAlert(
    //     "warning",
    //     "Password must contain both uppercase and lowercase letters"
    //   );
    //   return false;
    // }
    // if (!hasNumber) {
    //   showAlert("warning", "Password must contain at least one number");
    //   return false;
    // }
    // if (!hasSpecialChar) {
    //   showAlert(
    //     "warning",
    //     "Password must contain at least one special character"
    //   );
    //   return false;
    // }
    return true;
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showAlert("error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert("error", "New passwords do not match");
      return;
    }

    if (!validatePassword(newPassword)) {
      return;
    }

    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem("authToken");
      // API call would go here
      const response = await axios.post(
        `${BASE_URL}/api/user/change-password/`,
        {
          password1: currentPassword,
          password2: newPassword,
          new_password: confirmPassword,
        },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        showAlert("success", "Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
      //if()
    } catch (error) {
      showAlert("error", "İnvalid Password Provided please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <CustomAlert
          visible={alert.visible}
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert((prev) => ({ ...prev, visible: false }))}
        />

        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialIcons
              name="arrow-back-ios"
              size={24}
              style={{ color: "#000" }}
              onPress={handleBack}
            />
          </View>
          <MaterialIcons name="lock-reset" size={45} style={styles.icon} />
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.subtitle}>
            Secure your account with a new password
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showCurrent}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                onFocus={() => animateLine(currentLineAnim, 1)}
                onBlur={() => animateLine(currentLineAnim, 0)}
                placeholder="Enter your current password"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <ShowEye /> : <HideEye />}
              </TouchableOpacity>
            </View>
            <View style={styles.inputUnderline} />
            <Animated.View
              style={[
                styles.inputUnderlineAnimated,
                { transform: [{ scaleX: currentLineAnim }] },
              ]}
            />
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showNew}
                value={newPassword}
                onChangeText={setNewPassword}
                onFocus={() => animateLine(newLineAnim, 1)}
                onBlur={() => animateLine(newLineAnim, 0)}
                placeholder="Enter your new password"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNew(!showNew)}
              >
                {showNew ? <ShowEye /> : <HideEye />}
              </TouchableOpacity>
            </View>
            <View style={styles.inputUnderline} />
            <Animated.View
              style={[
                styles.inputUnderlineAnimated,
                { transform: [{ scaleX: newLineAnim }] },
              ]}
            />
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => animateLine(confirmLineAnim, 1)}
                onBlur={() => animateLine(confirmLineAnim, 0)}
                placeholder="Enter your confirm password"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <ShowEye /> : <HideEye />}
              </TouchableOpacity>
            </View>
            <View style={styles.inputUnderline} />
            <Animated.View
              style={[
                styles.inputUnderlineAnimated,
                { transform: [{ scaleX: confirmLineAnim }] },
              ]}
            />
          </View>
        </View>

        <View style={styles.requirementsContainer}>
          <TouchableOpacity
            style={[
              styles.requirementsHeader,
              isRequirementsVisible && { marginBottom: 15 },
            ]}
            onPress={() => setIsRequirementsVisible(!isRequirementsVisible)}
          >
            <Text style={styles.requirementsTitle}>Password Requirements</Text>
            <MaterialIcons
              name={
                isRequirementsVisible
                  ? "keyboard-arrow-up"
                  : "keyboard-arrow-down"
              }
              size={24}
              color="#000"
            />
          </TouchableOpacity>

          {isRequirementsVisible && (
            <View style={styles.requirementsList}>
              <View style={styles.requirementRow}>
                <MaterialIcons name="check-circle" size={16} color="#8ACEFF" />
                <Text style={styles.requirementText}>Minimum 8 characters</Text>
              </View>
              <View style={styles.requirementRow}>
                <MaterialIcons name="check-circle" size={16} color="#8ACEFF" />
                <Text style={styles.requirementText}>One uppercase letter</Text>
              </View>
              <View style={styles.requirementRow}>
                <MaterialIcons name="check-circle" size={16} color="#8ACEFF" />
                <Text style={styles.requirementText}>One lowercase letter</Text>
              </View>
              <View style={styles.requirementRow}>
                <MaterialIcons name="check-circle" size={16} color="#8ACEFF" />
                <Text style={styles.requirementText}>One number</Text>
              </View>
              <View style={styles.requirementRow}>
                <MaterialIcons name="check-circle" size={16} color="#8ACEFF" />
                <Text style={styles.requirementText}>
                  One special character
                </Text>
              </View>
            </View>
          )}
        </View>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Updating Password..." : "Update Password"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  icon: {
    color: "#7DC8FF",
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontFamily: "Figtree-Bold",
    marginTop: 15,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    fontFamily: "Figtree-Regular",
  },
  inputContainer: {
    width: "100%",
    marginTop: 20,
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 25,
    position: "relative",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  inputUnderline: {
    height: 1,
    marginLeft: 10,
    width: "92%",
    position: "absolute",
    bottom: -1,
    backgroundColor: "#7d7d7dcc",
  },
  inputUnderlineAnimated: {
    height: 2,
    width: "100%",
    position: "absolute",
    bottom: -1,
  },
  eyeIcon: {
    padding: 8,
  },
  requirementsContainer: {
    marginTop: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#7C3AED40",
    shadowOffset: {
      width: 8,
      height: 8,
    },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },
  requirementsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  requirementsList: {
    marginTop: 10,
  },
  requirementsTitle: {
    fontSize: 18,
    fontFamily: "Figtree-Bold",
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  requirementText: {
    fontSize: 14,
    marginLeft: 8,
    fontFamily: "Figtree-Regular",
  },
  button: {
    paddingVertical: 18,
    width: "80%",
    borderRadius: 30,
    alignItems: "center",
    backgroundColor: "#CEEAFF",
    shadowColor: "#7C3AED40",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  buttonDisabled: {
    backgroundColor: "#7d7d7dcc",
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Figtree-Bold",
    letterSpacing: 0.5,
  },
});

export default ChangePassword;
