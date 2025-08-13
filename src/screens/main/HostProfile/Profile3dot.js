import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Share,
  Linking,
  BackHandler,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  MaterialIcons,
  Ionicons,
  Feather,
  FontAwesome,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../../../constant/BaseConst";
import Toast from "../../../components/Toast/Toast";

// Custom Alert Component for confirmations
const CustomAlert = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText,
  confirmColor,
  cancelText,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={alertStyles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                alertStyles.alertContainer,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: scaleAnim,
                },
              ]}
            >
              <View style={alertStyles.titleContainer}>
                <Text style={alertStyles.title}>{title}</Text>
              </View>
              <View style={alertStyles.messageContainer}>
                <Text style={alertStyles.message}>{message}</Text>
              </View>
              <View style={alertStyles.buttonContainer}>
                <TouchableOpacity
                  style={alertStyles.cancelButton}
                  onPress={onCancel}
                >
                  <Text style={alertStyles.cancelButtonText}>
                    {cancelText || "Cancel"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    alertStyles.confirmButton,
                    { backgroundColor: confirmColor || "#0A66C2" },
                  ]}
                  onPress={onConfirm}
                >
                  <Text style={alertStyles.confirmButtonText}>
                    {confirmText || "Confirm"}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const Profile3dot = ({ visible, onClose, hostProfile }) => {
  const navigation = useNavigation();
  const [isBridged, setIsBridged] = useState(hostProfile?.isBridged || false);

  // States for custom alerts
  const [reportAlertVisible, setReportAlertVisible] = useState(false);
  const [blockAlertVisible, setBlockAlertVisible] = useState(false);
  const [muteAlertVisible, setMuteAlertVisible] = useState(false);

  // Toast notification state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Handle hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (visible) {
          onClose();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [visible]);
  //console.log(hostProfile.id);

  const handleClose = () => {
    onClose();
  };

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const handleShare = async () => {
    try {
      const profileLink =
        hostProfile?.profileLink ||
        `https://advisor.com/${hostProfile?.username || "user"}`;
      await Share.share({
        message: `Check out ${
          hostProfile?.displayName || "this user"
        }'s profile: ${profileLink}`,
      });
      handleClose();
    } catch (error) {
      showToast("Failed to share profile");
    }
  };

  const handleCopyLink = async () => {
    try {
      const profileLink =
        hostProfile?.profileLink ||
        `https://yourapp.com/profile/${hostProfile?.username || "user"}`;
      await Clipboard.setStringAsync(profileLink);
      showToast("Profile link copied!");
    } catch (error) {
      showToast("Failed to copy link");
    }
  };

  const handleReportConfirm = async (reportData) => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/report/${hostProfile?.id}/`,
        {
          reason: "Your Reason",
          message: "Mention your message if possible or null",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      // console.log(response);

      if (response.status === 201) {
        onClose();
        console.log("Profile reported:", hostProfile?.id);
        setReportAlertVisible(false);
        showToast("Profile reported successfully");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      // showToast("Error generating report");
    }

    // Process the report data (send to server, etc.)
  };

  const handleToggleBridge = () => {
    setIsBridged(!isBridged);
    // Add API call to bridge/unbridge user
    console.log(
      isBridged ? "Unbridging user" : "Bridging user",
      hostProfile?.id
    );
    showToast(isBridged ? "User unbridged" : "User bridged");
  };

  const handleBlockConfirm = () => {
    // Add your block logic here
    console.log("User blocked:", hostProfile?.id);
    setBlockAlertVisible(false);
    showToast("User blocked");
    handleClose();
  };

  const handleMuteConfirm = () => {
    // Add your mute logic here
    console.log("User muted:", hostProfile?.id);
    setMuteAlertVisible(false);
    showToast("User muted");
    handleClose();
  };

  return (
    <>
      <Modal
        transparent
        visible={visible}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.header}>
                  <Text style={styles.headerText}>Profile Options</Text>
                  <TouchableOpacity
                    onPress={handleClose}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.option} onPress={handleShare}>
                  <Ionicons
                    name="share-social-outline"
                    size={20}
                    color="#333"
                  />
                  <Text style={styles.optionText}>Share Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.option}
                  onPress={handleCopyLink}
                >
                  <Ionicons name="copy-outline" size={20} color="#333" />
                  <Text style={styles.optionText}>Copy Profile Link</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.option}
                  onPress={handleToggleBridge}
                >
                  <FontAwesome
                    name={isBridged ? "chain-broken" : "chain"}
                    size={20}
                    color="#0A66C2"
                  />
                  <Text style={styles.optionText}>
                    {isBridged ? "Unbridge" : "Bridge"} User
                  </Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => setMuteAlertVisible(true)}
                                >
                                    <Feather name="volume-x" size={20} color="#FF9500" />
                                    <Text style={styles.optionText}>Mute User</Text>
                                </TouchableOpacity> */}

                <TouchableOpacity
                  style={styles.option}
                  onPress={() => setBlockAlertVisible(true)}
                >
                  <Feather name="slash" size={20} color="#FF3B30" />
                  <Text style={[styles.optionText, styles.warningText]}>
                    Block User
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.option}
                  onPress={() => setReportAlertVisible(true)}
                >
                  <MaterialIcons
                    name="report-problem"
                    size={20}
                    color="#FF3B30"
                  />
                  <Text style={[styles.optionText, styles.warningText]}>
                    Report Profile
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Toast notification */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        onDismiss={() => setToastVisible(false)}
      />

      {/* Custom Alert Modals for confirmation actions */}
      <CustomAlert
        visible={reportAlertVisible}
        title="Report Profile"
        message="Are you sure you want to report this profile? This action cannot be undone."
        confirmText="Report"
        confirmColor="#FF3B30"
        onCancel={() => setReportAlertVisible(false)}
        onConfirm={handleReportConfirm}
      />

      <CustomAlert
        visible={blockAlertVisible}
        title="Block User"
        message="Are you sure you want to block this user? They will not be able to see your profile or contact you."
        confirmText="Block"
        confirmColor="#FF3B30"
        onCancel={() => setBlockAlertVisible(false)}
        onConfirm={handleBlockConfirm}
      />

      <CustomAlert
        visible={muteAlertVisible}
        title="Mute User"
        message="Are you sure you want to mute this user? You will not see their posts in your feed."
        confirmText="Mute"
        confirmColor="#FF9500"
        onCancel={() => setMuteAlertVisible(false)}
        onConfirm={handleMuteConfirm}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30, // Add extra padding at the bottom for better UX
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerText: {
    fontSize: 16,
    fontFamily: "Figtree-Medium",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
    fontFamily: "Figtree-Regular",
  },
  warningText: {
    color: "#FF3B30",
  },
});

const alertStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleContainer: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "Figtree-Bold",
    color: "#333",
    textAlign: "center",
  },
  messageContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  message: {
    fontSize: 16,
    fontFamily: "Figtree-Regular",
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRightWidth: 0.5,
    borderRightColor: "#f0f0f0",
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: "Figtree-Medium",
    color: "#666",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderLeftWidth: 0.5,
    borderLeftColor: "#f0f0f0",
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: "Figtree-Bold",
    color: "white",
  },
});

export default Profile3dot;
