import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Image,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import Comment from "./Comment";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../constant/BaseConst";
import CustomAlert from "../CustomAlert";
import axios from "axios";

const ReelCommentModalScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { reelId } = route.params || {};
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [userProfile, setUserProfile] = useState(null); // Default profile image
  const [userName, setUserName] = useState("You");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    visible: false,
    type: "",
    message: "",
  });

  //console.log(reelId);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const { data } = await axios.get(
        `${BASE_URL}/api/reels/${reelId}/comments/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setComments(data.results);
      setLoading(false);
      // console.log(data.results);
      // reset error on successful fetch
    } catch (err) {
      console.error("Error fetching posts:", err);
      setLoading(false);
    }
  }, []);

  // Function to add a new comment:)
  const addComment = async () => {
    if (commentText.trim() === "") return;

    const tempId = Date.now().toString();
    const newComment = {
      id: tempId,
      comment: commentText,
      user: {
        username: userProfile ? userProfile.name : "You",
        display_name: userProfile ? userProfile.display_name : "You",
        image: userProfile
          ? userProfile.image
          : "https://randomuser.me/api/portraits/men/1.jpg",
      },
      date_created: new Date().toISOString(),
    };

    // Update UI immediately-__-
    setComments(prevComments => [newComment, ...prevComments]);
    setCommentText("");
    Keyboard.dismiss();

    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.post(
        `${BASE_URL}/api/reels/${reelId}/comments/`,
        {
          comment: commentText,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 201) {
        //  update the temporary comment with the real one
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === tempId ? response.data : comment
          )
        );
      }
    } catch (error) {
      // Remove the temporary comment if the API call fails!!
      setComments(prevComments =>
        prevComments.filter(comment => comment.id !== tempId)
      );
      console.error("Error creating comment:", error);
      setAlert({
        visible: true,
        type: "error",
        message: "Failed to creating comment. Please try again.",
      });
    }
  };

  // Load user data when component mounts
  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("authToken");
        const { data } = await axios.get(
          `${BASE_URL}/api/reels/${reelId}/comments/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setComments(data.results);
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    };

    initialFetch();

    const loadUserData = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem("userName");
        const storedUserProfile = await AsyncStorage.getItem("userProfile");

        if (storedUserName) setUserName(storedUserName);
        if (storedUserProfile) setUserProfile(JSON.parse(storedUserProfile));
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();

    // Set up keyboard listeners to handle keyboard appearance
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    // Clean up listeners
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  console.log(reelId);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thoughts</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Use a regular View instead of KeyboardAvoidingView for Android */}
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.commentContainer}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={styles.commentsListContainer}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#97D3FF"
                style={styles.loader}
              />
            ) : comments.length > 0 ? (
              <Comment
                reelId={reelId}
                additionalComments={comments}
                allComments={comments}
                fetchComments={fetchComments}
                setAlert={setAlert}
              />
            ) : (
              <View style={styles.emptyStateContainer}>
                <MaterialIcons name="sentiment-dissatisfied" size={50} color="#97D3FF" />
                <Text style={styles.emptyStateText}>No thoughts shared yet!</Text>
                <Text style={styles.emptyStateSubText}>Be the first one to share your thoughts</Text>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            {userProfile?.image ? (
              <Image
                source={{
                  uri: userProfile?.image,
                }}
                style={styles.userAvatar}
              />
            ) : (
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/men/41.jpg",
                }}
                style={styles.userAvatar}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Add your thoughts..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { opacity: commentText.trim() ? 1 : 0.5 },
              ]}
              onPress={addComment}
              disabled={!commentText.trim()}
            >
              <MaterialIcons name="send" size={24} color="#0066CC" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        // For Android, use a different approach
        <View style={styles.commentContainer}>
          <View
            style={[
              styles.commentsListContainer,
              { marginBottom: keyboardHeight > 0 ? 0 : 0 },
            ]}
          >
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#97D3FF"
                style={styles.loader}
              />
            ) : comments.length > 0 ? (
              <Comment
                reelId={reelId}
                additionalComments={comments}
                allComments={comments}
                fetchComments={fetchComments}
                setAlert={setAlert}
              />
            ) : (
              <View style={styles.emptyStateContainer}>
                <MaterialIcons name="sentiment-neutral" size={50} color="#97D3FF" />
                <Text style={styles.emptyStateText}>No thoughts shared yet!</Text>
                <Text style={styles.emptyStateSubText}>Be the first one to share your thoughts</Text>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            {userProfile?.image ? (
              <Image
                source={{
                  uri: userProfile?.image,
                }}
                style={styles.userAvatar}
              />
            ) : (
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/men/41.jpg",
                }}
                style={styles.userAvatar}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Add your thoughts..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { opacity: commentText.trim() ? 1 : 0.5 },
              ]}
              onPress={addComment}
              disabled={!commentText.trim()}
            >
              <MaterialIcons
                name="send"
                size={24}
                color="#0066CC"
                style={{ transform: [{ rotate: "0deg" }] }}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Figtree-Bold",
  },
  closeButton: {
    padding: 4,
  },
  placeholder: {
    width: 24,
  },
  commentContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  commentsListContainer: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "#ffffff",
    paddingHorizontal: 0,
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 80,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
    fontFamily: "Figtree-Regular",
    fontSize: 16,
    backgroundColor: "#f8f8f8",
  },
  sendButton: {
    marginLeft: 10,
    padding: 6,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100, 
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Figtree-Bold',
    color: '#536471',
    marginTop: 12,
  },
  emptyStateSubText: {
    fontSize: 14,
    fontFamily: 'Figtree-Regular',
    color: '#8E8E8E',
    marginTop: 8,
  },
});

export default ReelCommentModalScreen;
