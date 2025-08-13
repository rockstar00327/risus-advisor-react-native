import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  BackHandler,
  Animated,
  Platform,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  MaterialIcons,
  Ionicons,
  Feather,
  AntDesign,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ShareModal from "../ShareModal/ShareModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../constant/BaseConst";
import axios from "axios";

const Post3dots = ({
  visible,
  onClose,
  postId,
  postData,
  onDelete,
  onEdit,
  onReport,
  isOwnPost = false,
  showToast,
  handleBookMark,
}) => {
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [shareModalVisible, setShareModalVisible] = useState(false);

  // Animate modal on mount
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Handle hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (shareModalVisible) {
          setShareModalVisible(false);
          return true;
        }
        if (visible) {
          onClose(); // Just close the options modal
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [visible, shareModalVisible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleDelete = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: handleClose,
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          if (onDelete) {
            onDelete(postId);
          }
          handleClose();
        },
      },
    ]);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(postId);
    }
    handleClose();
  };

  const handleReport = () => {
    if (onReport) {
      onReport(postId);
    }
    handleClose();
  };

  const handleShare = () => {
    handleClose();
    setTimeout(() => {
      setShareModalVisible(true);
    }, 300);
  };

  const handleCopyLink = async () => {
    try {
      const profileLink =
        hostProfile?.profileLink ||
        `https://yourapp.com/feed/${postId || "post"}`;
      await Clipboard.setStringAsync(profileLink);
      showToast("Profile link copied!");
    } catch (error) {
      showToast("Failed to copy link");
    }
  };

  const handleToggleBridge = async () => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/bridge/`,
        {
          bridged_user: postData.user.user_id,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Cache-Control": "no-cache",
          },
        }
      );
      if (response.status === 201) {
        handleClose();
        showToast(`${postData.user.display_name} bridged`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Calculate slide animation
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <>
      <Modal
        transparent
        visible={visible}
        animationType="none" // Using custom animation
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.modalContainer}>
            <Animated.View
              style={[styles.modalContent, { transform: [{ translateY }] }]}
            >
              <View style={styles.header}>
                <View style={styles.handle} />
                <Text style={styles.headerText}>Post Options</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.option} onPress={handleShare}>
                  <Feather name="share-2" size={20} color="#0063AC" />
                  <Text style={styles.optionText}>Share Post</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    // Add bookmark functionality
                    handleBookMark(postId);
                    // console.log("Bookmark post:", postId);
                    handleClose();
                  }}
                >
                  <Feather
                    name="bookmark"
                    size={20}
                    //color={postData.is_bookmarked ? "red" : "#0063AC"}
                    color={"#0063AC"}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      // postData.is_bookmarked && { color: "red" },
                    ]}
                  >
                    {postData?.is_bookmarked ? "Unbookmark" : "Bookmark"}
                  </Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  style={styles.option}
                  onPress={handleCopyLink}
                >
                  <Feather name="link" size={20} color="#0063AC" />
                  <Text style={styles.optionText}>Copy Link</Text>
                </TouchableOpacity> */}

                {!isOwnPost && (
                  <>
                    <TouchableOpacity
                      style={styles.option}
                      onPress={handleToggleBridge}
                    >
                      <Feather name="user-plus" size={20} color="#0063AC" />
                      <Text style={styles.optionText}>Bridge User</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                      style={styles.option}
                      onPress={() => {
                        // Add hide post functionality
                        console.log("Hide post:", postId);
                        handleClose();
                      }}
                    >
                      <Feather name="eye-off" size={20} color="#FF9500" />
                      <Text style={[styles.optionText, { color: "#FF9500" }]}>
                        Hide Post
                      </Text>
                    </TouchableOpacity>*/}

                    <TouchableOpacity
                      style={styles.option}
                      onPress={handleReport}
                    >
                      <AntDesign name="flag" size={20} color="#FF9500" />
                      <Text style={[styles.optionText, { color: "#FF9500" }]}>
                        Report Post
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.warningOption}
                      onPress={() => {
                        Alert.alert(
                          "Block User",
                          "Are you sure you want to block this user?",
                          [
                            {
                              text: "Cancel",
                              style: "cancel",
                            },
                            {
                              text: "Block",
                              style: "destructive",
                              onPress: () => {
                                console.log("Block user of post:", postId);
                                handleClose();
                              },
                            },
                          ]
                        );
                      }}
                    >
                      <Feather name="slash" size={20} color="#FF3B30" />
                      <Text style={styles.deleteText}>Block User</Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* {isOwnPost && (
                                    <>
                                        <TouchableOpacity
                                            style={styles.option}
                                            onPress={handleEdit}
                                        >
                                            <Feather name="edit-2" size={20} color="#0063AC" />
                                            <Text style={styles.optionText}>Edit Post</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity
                                            style={styles.option}
                                            onPress={() => {
                                                // Add stats/analytics functionality
                                                console.log("View post stats:", postId);
                                                handleClose();
                                            }}
                                        >
                                            <Feather name="bar-chart-2" size={20} color="#0063AC" />
                                            <Text style={styles.optionText}>View Stats</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity
                                            style={styles.deleteOption}
                                            onPress={handleDelete}
                                        >
                                            <MaterialIcons name="delete-outline" size={20} color="#FF3B30" />
                                            <Text style={styles.deleteText}>Delete Post</Text>
                                        </TouchableOpacity>
                                    </>
                                )} */}
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ShareModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        postContent={postData?.content || "Check out this post!"}
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
    paddingBottom: Platform.OS === "ios" ? 40 : 16, // Extra padding for iOS
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    position: "absolute",
    top: 6,
    alignSelf: "center",
    left: "50%",
    marginLeft: -20,
  },
  headerText: {
    fontSize: 16,
    fontFamily: "Figtree-Medium",
    color: "#333",
    flex: 1,
    textAlign: "center",
    marginLeft: 24, // Offset for the close button
  },
  closeButton: {
    padding: 4,
  },
  optionsContainer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#0063AC",
    fontFamily: "Figtree-Regular",
  },
  deleteOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginTop: 8,
  },
  deleteText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#FF3B30",
    fontFamily: "Figtree-Regular",
  },
  warningOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginTop: 8,
  },
});

export default Post3dots;
