import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../constant/BaseConst";
import { Alert } from "react-native";
import axios from "axios";

// User data for sharing
const userData = [
  {
    id: 1,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    username: "Sangwon Lee",
  },
  {
    id: 2,
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    username: "Tafsirul Islam",
  },
  {
    id: 3,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    username: "Suhaib Safwan",
  },
  {
    id: 4,
    image: "https://randomuser.me/api/portraits/women/17.jpg",
    username: "Humaira",
  },
  {
    id: 5,
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    username: "Golam Faruk",
  },
  {
    id: 6,
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    username: "Smith jason",
  },
  {
    id: 7,
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    username: "John Doe",
  },
  {
    id: 8,
    image: "https://randomuser.me/api/portraits/men/10.jpg",
    username: "Alex king",
  },
  {
    id: 9,
    image: "https://randomuser.me/api/portraits/men/80.jpg",
    username: "Skibidi Dubi",
  },
];

const ShareModal = ({ visible, onClose, postContent, postId, navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await fetch(`${BASE_URL}/api/user/get-share-list/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      const result = await response.json();
      //console.log(result);
      if (response.ok) {
        setAllUsers(result);
        setLoading(false);
      }
      // console.log(result.results);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset selections when modal is closed or opened
  useEffect(() => {
    if (!visible) {
      // Reset search and selections when modal is closed
      setSearchText("");
      setSelectedUsers([]);
    }
  }, [visible]);

  // Filter users based on search text
  const filteredUsers =
    allUsers?.filter((user) =>
      user.username.toLowerCase().includes(searchText.toLowerCase())
    ) || [];

  // Toggle user selection
  const toggleUserSelection = (user) => {
    if (selectedUsers.some((selectedUser) => selectedUser.id === user.id)) {
      setSelectedUsers(
        selectedUsers.filter((selectedUser) => selectedUser.id !== user.id)
      );
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Render each user item
  const renderUserItem = ({ item }) => {
    const isSelected = selectedUsers.some((user) => user.id === item.id);

    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => toggleUserSelection(item)}
        activeOpacity={0.7}
      >
        <View style={styles.userInfoContainer}>
          <Image source={{ uri: item.image }} style={styles.userImage} />
          <Text style={styles.username}>
            {item.first_name} {item.last_name}
          </Text>
        </View>
        <View
          style={[
            styles.checkCircle,
            isSelected ? styles.selectedCheckCircle : {},
          ]}
        >
          {isSelected && <Ionicons name="locate" size={20} color="black" />}
        </View>
      </TouchableOpacity>
    );
  };

  // Handle share action
  const handleShare = async () => {
    if (selectedUsers.length === 0) return;

    const token = await AsyncStorage.getItem("authToken");
    const postLink = `${BASE_URL}/post/${postId}`; // Custom post link
    //console.log(postLink);
    const results = [];

    try {
      setSharing(true);
      // Process users sequentially
      for (const user of selectedUsers) {
        // console.log(user);
        try {
          const response = await axios.post(
            `${BASE_URL}/api/rooms/`,
            {
              is_group: false,
              to_user: user.id,
              content: `Check out this post: ${postLink}`,
            },
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
          console.log(response.data);
          if (response.data) {
            const res2 = await axios.post(
              `${BASE_URL}api/rooms/${response.data.id}/messages/`,
              {
                content: `Check out this post: ${postLink}`,
              },
              {
                headers: {
                  Authorization: `Token ${token}`,
                },
              }
            );
            console.log(res2);
          }

          if (!response.ok) {
            throw new Error(`Failed to share with ${user.username}`);
          }

          const data = await response.json();
          results.push({ success: true, user: user.username, data });

          // Optional: Add small delay between requests if needed
          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (error) {
          console.error(`Error sharing with ${user.username}:`, error);
          results.push({
            success: false,
            user: user.username,
            error: error.message,
          });
          // Continue with next user even if one fails
        }
      }

      // Check if any shares failed
      const failedShares = results.filter((result) => !result.success);
      if (failedShares.length > 0) {
        const errorMessage =
          `Failed to share with ${failedShares.length} user(s):\n` +
          failedShares.map((f) => `${f.user}: ${f.error}`).join("\n");
        Alert.alert("Partial Success", errorMessage);
      } else {
        Alert.alert(
          "Success",
          "Post shared successfully with all selected users"
        );
      }

      // Reset and close
      setSelectedUsers([]);
      setSearchText("");
      onClose();

      // Navigate to inbox list
      navigation.navigate("Inbox");
    } catch (error) {
      console.error("Sharing error:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while sharing the post."
      );
    } finally {
      setSharing(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setSelectedUsers([]); // Reset selections when closing with back button
        setSearchText("");
        onClose();
      }}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          setSelectedUsers([]); // Reset selections when tapping outside
          setSearchText("");
          onClose();
        }}
      >
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <Text style={styles.modalTitle}>Share with</Text>
              <Ionicons
                name="paper-plane"
                size={20}
                color="#333"
                style={{ transform: [{ rotate: "10deg" }] }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setSelectedUsers([]); // Reset selections when closing with X button
                setSearchText("");
                onClose();
              }}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {postContent && (
            <View style={styles.postPreview}>
              <Text style={styles.postPreviewText} numberOfLines={3}>
                {postContent}
              </Text>
            </View>
          )}

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />
            <MaterialIcons
              name="search"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />
          </View>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#0077B5"
              style={styles.loader}
            />
          ) : allUsers.length > 0 ? (
            <FlatList
              data={filteredUsers}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.userList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text>No users to share </Text>
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.shareButton,
                selectedUsers.length === 0 ? styles.disabledButton : {},
              ]}
              disabled={selectedUsers.length === 0}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              {sharing ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.shareButtonText}>
                  Share{" "}
                  {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ""}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Figtree-Bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  postPreview: {
    backgroundColor: "#f0f2f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  postPreviewText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Figtree-Medium",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    fontFamily: "Figtree-Regular",
  },
  userList: {
    maxHeight: 400,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f5",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Figtree-Regular",
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCheckCircle: {
    backgroundColor: "#CEEAFF",
    borderColor: "#CEEAFF",
  },
  footer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f2f5",
  },
  shareButton: {
    backgroundColor: "#1877f2",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#CEEAFF",
  },
  shareButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Figtree-Bold",
  },
});

export default ShareModal;
