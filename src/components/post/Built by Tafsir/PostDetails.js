import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Keyboard,
  ActivityIndicator,
  BackHandler,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  Feather,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import Comment from "../../../components/CommentModal/Comment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../../../constant/BaseConst";

import Detail3dotModal from "./Detail3dotModal";

import ShareModal from "../../ShareModal/ShareModal";
import Toast from "../../Toast/Toast";
import { SlideInLeft, SlideInRight } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const PostDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { post } = route.params || {}; // Add fallback empty object
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postDetail, setPostDetail] = useState(post || {});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [userName, setUserName] = useState("You");
  const [shareModalVisible, setShareModalVisible] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [pendingLikes, setPendingLikes] = useState({});
  const [alert, setAlert] = useState({
    visible: false,
    type: "",
    message: "",
  });
  const scrollViewRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchPostDetail = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const { data } = await axios.get(`${BASE_URL}/api/posts/${post.id}`, {
        headers: { Authorization: `Token ${token}` },
      });
      setPostDetail(data);
      setLoading(false);
      //console.log(data);
      // reset error on successful fetch
    } catch (err) {
      console.error("Error fetching posts:", err);
      setLoading(false);
    }
  }, []);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const { data } = await axios.get(
        `${BASE_URL}/api/post-comments/?post=${post.id}`,
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

  React.useEffect(() => {
    // Set status bar to light content when component mounts
    StatusBar.setBarStyle("dark-content");
    StatusBar.setBackgroundColor("#ffffff");

    // Load user data
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
    fetchPostDetail();
    loadUserData();
    fetchComments();

    return () => {
      StatusBar.setBarStyle("default");
    };
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        return true;
      }
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, [navigation]);

  // to add a new comment
  const addComment = async () => {
    if (commentText.trim() === "") return;

    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/post-comments/?post=${post.id}`,
        {
          content: commentText,
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
        setCommentText("");
        fetchComments();
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      setAlert({
        visible: true,
        type: "error",
        message: "Failed to creating comment. Please try again.",
      });
    } finally {
    }
    Keyboard.dismiss();
  };

  // Toggle comment input visibility
  const toggleCommentInput = () => {
    setShowCommentInput(!showCommentInput);

    // If showing the input, scroll to it after a short delay to ensure it's visible
    if (!showCommentInput) {
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }, 300);
    }
  };

  // Add this function to handle replies to additional comments
  const handleAddReplyToAdditional = (commentId, newReply) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      })
    );
  };

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  // Add these handler functions
  const handleReport = async () => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/posts/${post.id}/report/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      console.log(response.data);

      if (response.status === 200) {
        console.log("Profile reported:", response.data.post);
        setModalVisible(false);
        showToast(`You reported the post Id: ${response.data.post}`);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      // showToast("Error generating report");
    }
    console.log("Report submitted:", reportData);
  };

  const handleShare = () => {
    console.log("Share post");
    setModalVisible(false);
  };

  const handleSave = async () => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/post-bookmarks/`,
        { post: post.id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      // console.log(response.status);

      if (response.status === 201) {
        console.log("Post Bookmarked:", post.id);
        showToast(`Bookmarked post Id: ${response.data.post}`);
        console.log("Save post");
        setModalVisible(false);
      }
      if (response.status === 200) {
        console.log("Post unBookmarked:", post.id);
        showToast(`${response.data.message}: ${post.id}`);
        console.log("Save post");
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error generating bookmark:", error);
      showToast("Already bookmarked!");
    }
  };

  const handleHide = () => {
    console.log("Hide post");
    setModalVisible(false);
  };

  const handleLike = async (post) => {
    if (!post) return;
    console.log("like pressed");

    const wasLiked = post.is_liked;
    const previousLikes = post.total_likes || 0;

    // Immediately update UI
    setPostDetail((prev) => ({
      ...prev,
      is_liked: !wasLiked,
      total_likes: wasLiked
        ? (prev.total_likes || 0) - 1
        : (prev.total_likes || 0) + 1,
    }));

    // Track pending update
    setPendingLikes((prev) => ({
      ...prev,
      [post.id]: {
        wasLiked,
        previousLikes,
        timestamp: Date.now(),
      },
    }));

    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.post(
        `${BASE_URL}/api/posts/${post.id}/like-post/`,
        null,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      console.log(response);
      if (response.status !== 200) {
        console.log(response);
        throw new Error("Like failed");
      }

      // Remove from pending if successful
      setPendingLikes((prev) => {
        const newPending = { ...prev };
        delete newPending[post.id];
        return newPending;
      });
    } catch (error) {
      console.error("Error updating like:", error.message);

      // Revert UI if API call fails
      setPostDetail((prev) => ({
        ...prev,
        is_liked: wasLiked,
        total_likes: previousLikes,
      }));

      showToast("Failed to update like. Please try again.");
    }
  };

  const handleSharePress = (post) => {
    setShareModalVisible(post.id);
    setModalVisible(false); // Store the post ID in state
  };

  // Add error handling for missing data
  if (!post) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back-outline" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Contribution Details</Text>
            <View style={styles.headerRight} />
          </View>
          <View
            style={[
              styles.container,
              { justifyContent: "center", alignItems: "center" },
            ]}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Figtree-Regular",
                color: "#000",
              }}
            >
              No contribution data available
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  //console.log(post);

  const ImageComponent = ({ index }) => (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={() => {
        navigation.navigate("ImageFullView", {
          images: post.images,
          currentIndex: index,
          title: post.title,
          content: post.content,
        });
      }}
    >
      <Image
        source={
          typeof post.images[index].image === "string"
            ? { uri: post.images[index].image }
            : post.images[index].image
        }
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contribution Details</Text>
          <View style={styles.space}></View>
        </View>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#97D3FF"
            style={styles.loader}
          />
        ) : (
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {/* User Info */}
            <View style={styles.userInfo}>
              <View style={styles.userInfoLeft}>
                <Image
                  source={
                    post?.user?.image
                      ? { uri: post.user.image }
                      : require("../../../assets/ProfileScreenImages/Profile.jpg")
                  }
                  style={styles.userImage}
                />
                <View>
                  <Text style={styles.userName}>
                    {post?.user?.display_name
                      ? post?.user?.display_name
                      : post?.user?.first_name
                      ? `${post?.user?.first_name} ${post?.user?.last_name}`
                      : "Unknown User"}
                  </Text>
                  <Text style={styles.userHandle}>
                    {`@${post?.user?.username}` || "@unknown"}
                  </Text>
                </View>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Feather name="more-vertical" size={20} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Image Grid */}
            <View style={styles.imageGrid}>
              {/* Dynamic rendering based on image count */}
              {(() => {
                const imageCount = post?.images?.length || 0;

                // Case 1: Single image (full width)
                if (imageCount === 1) {
                  return (
                    <View style={styles.fullWidthImage}>
                      <ImageComponent index={0} />
                    </View>
                  );
                }

                // Case 2: Two images (both in first row)
                if (imageCount === 2) {
                  return (
                    <View style={styles.row}>
                      <View style={styles.halfWidthImage}>
                        <ImageComponent index={0} />
                      </View>
                      <View style={styles.halfWidthImage}>
                        <ImageComponent index={1} />
                      </View>
                    </View>
                  );
                }

                // Case 3: Three images (1 full + 2 half)
                if (imageCount === 3) {
                  return (
                    <>
                      <View style={styles.fullWidthImage}>
                        <ImageComponent index={0} />
                      </View>
                      <View style={styles.row}>
                        <View style={styles.halfWidthImage}>
                          <ImageComponent index={1} />
                        </View>
                        <View style={styles.halfWidthImage}>
                          <ImageComponent index={2} />
                        </View>
                      </View>
                    </>
                  );
                }

                // Case 4: Four images (2 + 2)
                if (imageCount === 4) {
                  return (
                    <>
                      <View style={styles.row}>
                        <View style={styles.halfWidthImage}>
                          <ImageComponent index={0} />
                        </View>
                        <View style={styles.halfWidthImage}>
                          <ImageComponent index={1} />
                        </View>
                      </View>
                      <View style={styles.row}>
                        <View style={styles.halfWidthImage}>
                          <ImageComponent index={2} />
                        </View>
                        <View style={styles.halfWidthImage}>
                          <ImageComponent index={3} />
                        </View>
                      </View>
                    </>
                  );
                }

                // Case 5+: Five or more images (2 + 3 with overlay)
                if (imageCount >= 5) {
                  return (
                    <>
                      <View style={styles.row}>
                        <View style={styles.halfWidthImage}>
                          <ImageComponent index={0} />
                        </View>
                        <View style={styles.halfWidthImage}>
                          <ImageComponent index={1} />
                        </View>
                      </View>
                      <View style={styles.row}>
                        {[2, 3, 4].map((index) => (
                          <View
                            key={index}
                            style={[
                              styles.thirdWidthImage,
                              index === 4 && styles.lastImageContainer,
                            ]}
                          >
                            <ImageComponent index={index} />
                            {index === 4 && imageCount > 5 && (
                              <View
                                style={styles.remainingImagesOverlay}
                                pointerEvents="none"
                              >
                                <Text style={styles.remainingImagesText}>
                                  +{imageCount - 5}
                                </Text>
                              </View>
                            )}
                          </View>
                        ))}
                      </View>
                    </>
                  );
                }

                return null;
              })()}
            </View>

            {/* Caption */}
            <View style={styles.captionContainer}>
              <Text style={styles.captionTitle}>{post?.title || " "}</Text>
              <Text style={styles.caption}>{post?.content || " "}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <View style={styles.leftActions}>
                <TouchableOpacity
                  onPress={() => handleLike(postDetail)} // Pass postDetail instead of post
                  style={styles.actionIconText}
                  disabled={!!pendingLikes[postDetail?.id]}
                >
                  {postDetail?.is_liked ? (
                    <AntDesign
                      name="heart"
                      size={20}
                      color="#CEEAFF"
                      style={{ marginRight: 7 }}
                    />
                  ) : (
                    <Ionicons name="heart-outline" size={20} color="#97D3FF" />
                  )}

                  <Text style={styles.actionCount}>
                    {(postDetail?.total_likes || 0) >= 1000
                      ? ((postDetail?.total_likes || 0) / 1000).toFixed(
                          (postDetail?.total_likes || 0) % 1000 === 0 ? 0 : 1
                        ) + "K"
                      : postDetail?.total_likes || 0}
                  </Text>
                </TouchableOpacity>
                {/* Comment Button */}
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    showCommentInput && styles.activeActionButton,
                  ]}
                  onPress={toggleCommentInput}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={18}
                    color={showCommentInput ? "#0066CC" : "#97D3FF"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSharePress(post)}
                  style={styles.actionButton}
                >
                  <Ionicons
                    name="paper-plane-outline"
                    size={18}
                    color="#97D3FF"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.rightActions}>
                <TouchableOpacity
                  onPress={handleSave}
                  style={styles.actionButton}
                >
                  <Ionicons name="bookmark-outline" size={18} color="#97D3FF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Comment Input (shown when comment button is clicked) */}
            {showCommentInput && (
              <View style={styles.commentInputContainer}>
                {userProfile?.image ? (
                  <Image
                    source={{
                      uri: userProfile?.image,
                    }}
                    style={styles.commentUserAvatar}
                  />
                ) : (
                  <Image
                    source={{
                      uri: "https://randomuser.me/api/portraits/men/41.jpg",
                    }}
                    style={styles.commentUserAvatar}
                  />
                )}
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add your thoughts..."
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  maxLength={500}
                  autoFocus={true}
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
            )}

            {/* Comment Section */}
            <View style={styles.commentSection}>
              <Comment
                additionalComments={comments}
                onAddReplyToAdditional={handleAddReplyToAdditional}
                postId={post.id}
                allComments={comments}
                fetchComments={fetchComments}
                setAlert={setAlert}
              />
            </View>
          </ScrollView>
        )}
      </View>

      <Detail3dotModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onReport={handleReport}
        onShare={() => handleSharePress(post)}
        onSave={handleSave}
        onHide={handleHide}
      />
      <Toast
        visible={toastVisible}
        message={toastMessage}
        onDismiss={() => setToastVisible(false)}
      />

      <ShareModal
        visible={shareModalVisible === post.id} // Only open for the correct post
        onClose={() => setShareModalVisible(null)}
        postContent={post.content || "Check out this post!"}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    // paddingTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  space: {
    width: 20,
    height: 20,
    //backgroundColor : "red"
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 5,
    //paddingTop: 35,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    elevation: 0,
    zIndex: 1,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Figtree-Bold",
  },
  headerRight: {
    width: 24, // Match the width of the back button icon
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  userInfoLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontFamily: "Figtree-Bold",
  },
  userHandle: {
    fontSize: 14,
    fontFamily: "Figtree-Regular",
    color: "#666",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 2,
  },
  imageWrapper: {
    width: width / 2 - 4,
    height: width / 2 - 4,
    padding: 2,
  },
  topImages: {
    width: "50%",
    aspectRatio: 1,
  },
  bottomImages: {
    width: "50%",
    aspectRatio: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  captionContainer: {
    padding: 15,
  },
  captionTitle: {
    fontSize: 16,
    fontFamily: "Figtree-Bold",
    marginBottom: 8,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    fontFamily: "Figtree-Regular",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  leftActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    alignItems: "center",
    gap: 10,
    width: "55%",
    height: 36,
    borderRadius: 50,
    backgroundColor: "rgba(206, 234, 255, 0.7)",
  },
  actionIconText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    width: "30%",
    height: 28,
    borderRadius: 50,
    backgroundColor: "#F5FAFF",
    shadowColor: "#97D3FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  rightActions: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "rgba(206, 234, 255, 0.7)",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 25,
    backgroundColor: "#F5FAFF",
    shadowColor: "#97D3FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
    gap: 2,
  },
  actionCount: {
    fontSize: 14,
    fontFamily: "Figtree-Regular",
    color: "#666",
    marginLeft: 2,
  },
  commentSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#ffffff",
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
  },
  commentContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  commentUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: "600",
  },
  commentTime: {
    fontSize: 12,
    color: "#666",
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  replyButton: {
    marginTop: 5,
  },
  replyText: {
    fontSize: 14,
    color: "#666",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 20,
    marginHorizontal: 12,
  },
  commentUserAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  commentInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 80,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 6,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  sendButton: {
    marginLeft: 10,
    padding: 6,
  },
  activeActionButton: {
    backgroundColor: "#E6F2FF",
    borderWidth: 1,
    borderColor: "#97D3FF",
  },
  imageGrid: {
    width: "100%",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 2,
  },
  fullWidthImage: {
    width: "100%",
    aspectRatio: 16 / 9,
    marginBottom: 2,
  },
  halfWidthImage: {
    width: "49.5%",
    aspectRatio: 1,
    marginRight: "1%",
  },
  thirdWidthImage: {
    width: "32.33%",
    aspectRatio: 1,
    marginRight: "1%",
  },
  lastImageContainer: {
    position: "relative",
    marginRight: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  remainingImagesOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  remainingImagesText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default PostDetails;
