import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
} from "react-native";

import React, { useState, useCallback, useRef, useEffect } from "react";
import DotsMenuIcon from "../../../components/buttons/DotsMenuIcon";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Report3Dot from "./Report3Dot";
import { Feather, Ionicons } from "@expo/vector-icons";
import { shareContent } from "./ShareModal";
import RepostModal from "../RepostCreation/RepostModal";

import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../../constant/BaseConst";
import axios from "axios";
import ShareModal from "../../../components/ShareModal/ShareModal";
import CustomAlert from "../../../components/CustomAlert";
import Toast from "../../../components/Toast/Toast";

const HostContributions = ({ user, setToastMessage, setToastVisible }) => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(user);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [showRepostModal, setShowRepostModal] = useState(false);

  const [shareModalVisible, setShareModalVisible] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [use, setUse] = useState("AI");

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "",
    message: "",
  });

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const handleReportPost = async (postId) => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/posts/${postId}/report/`,
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
        console.log("Profile reported:", postId);
        showToast(`You reported the post Id: ${response.data.post}`);

        // setAlertConfig({
        //   visible: true,
        //   type: "success",
        //   message: `You reported the post Id: ${response.data.post}`,
        // });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      // showToast("Error generating report");
    }
    //console.log("Report submitted:", reportData);
  };

  const handleCommentPress = (id) => {
    // console.log("comment pressed");
    // Navigate to the CommentModal screen
    navigation.navigate("CommentModal", { postId: id });
  };

  const handleLike = async (post) => {
    const token = await AsyncStorage.getItem("authToken");

    // Store the original state for potential rollback
    const originalState = {
      is_liked: post.is_liked,
      total_likes: post.total_likes,
    };

    // Optimistic update - only UI changes, no API call yet
    setUserInfo((prevState) => ({
      ...prevState,
      posts: prevState.posts.map((p) => {
        if (p.id === post.id) {
          // Calculate new values
          const newIsLiked = !p.is_liked;
          const newTotalLikes = newIsLiked
            ? p.total_likes + 1
            : Math.max(0, p.total_likes - 1);

          return {
            ...p,
            is_liked: newIsLiked,
            total_likes: newTotalLikes,
          };
        }
        return p;
      }),
    }));

    try {
      // Make API call after optimistic update
      const response = await axios.post(
        `${BASE_URL}/api/posts/${post.id}/like-post/`,
        null,
        { headers: { Authorization: `Token ${token}` } }
      );

      // Verify if API response matches our action
      const serverAction = response.data?.message;
      const expectedAction = originalState.is_liked ? "Unliked" : "Liked";

      if (serverAction !== expectedAction) {
        // If mismatch, revert to original state
        setUserInfo((prevState) => ({
          ...prevState,
          posts: prevState.posts.map((p) => {
            if (p.id === post.id) {
              return {
                ...p,
                ...originalState,
              };
            }
            return p;
          }),
        }));

        // Then apply server state if available
        if (response.data.total_likes !== undefined) {
          setUserInfo((prevState) => ({
            ...prevState,
            posts: prevState.posts.map((p) => {
              if (p.id === post.id) {
                return {
                  ...p,
                  is_liked: serverAction === "Liked",
                  total_likes: response.data.total_likes,
                };
              }
              return p;
            }),
          }));
        }
      }
      // If actions match, our optimistic update was correct - no further action needed
    } catch (error) {
      console.error("Error updating like:", error.message);
      // On error, revert to original state
      setUserInfo((prevState) => ({
        ...prevState,
        posts: prevState.posts.map((p) => {
          if (p.id === post.id) {
            return {
              ...p,
              ...originalState,
            };
          }
          return p;
        }),
      }));
    }
  };

  const handleRepost = useCallback((post) => {
    setShowRepostModal(true);
    setSelectedPost({ ...post, user: user });
  }, []);

  const handleImagePress = (post) => {
    console.log("Image pressed, navigating to post details");
    navigation.navigate("PostDetails", { post: { ...post, user: user } });
  };

  const handleSharePress = (post) => {
    setShareModalVisible(post.id);
    const postData = {
      id: post.id,
      title: post.title || "Check out this post",
      content: post.content || "I found this interesting post",
      url: `https://yourdomain.com/posts/${post.id}`,
    };

    // shareContent(postData);
  };

  const renderPost = (post) => (
    <View key={post.id} style={styles.postItem}>
      <View style={styles.postHeader}>
        <View style={styles.postAuthorInfo}>
          {user?.image ? (
            <Image
              source={{ uri: user?.image }}
              style={styles.HostProfileImage}
            />
          ) : (
            <Image
              source={require("../../../assets/ProfileScreenImages/Profile.jpg")}
              style={styles.HostProfileImage}
            />
          )}

          <View>
            <Text style={styles.postAuthorName}>
              {user?.first_name && user?.last_name
                ? `${user?.first_name} ${user?.last_name}`
                : "No Name Given"}
            </Text>
            <Text style={styles.postUserId}>@{user?.username}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setReportModalVisible(post.id)}>
          <Feather name="more-vertical" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.postTextSection}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postContent}>{post.content}</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imageScrollView}
      >
        {post.images.map((image, index) => (
          <TouchableOpacity key={index} onPress={() => handleImagePress(post)}>
            <Image source={{ uri: image.image }} style={styles.postImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.postActions}>
        <TouchableOpacity
          onPress={() => handleLike(post)}
          style={[styles.actionButton, styles.likeButton]}
        >
          {/* posts liked reaction */}
          {post.is_liked ? (
            <AntDesign
              name="heart"
              size={20}
              color="#CEEAFF"
              style={{ marginRight: 7 }}
            />
          ) : (
            <Icon
              name="heart-outline"
              size={20}
              color="#7DC8FF"
              style={{ marginRight: 7 }}
            />
          )}
          {/* posts total like */}
          <Text style={styles.actionText}>
            {post.total_likes >= 1000
              ? (post.total_likes / 1000).toFixed(
                  post.total_likes % 1000 === 0 ? 0 : 1
                ) + "K"
              : post.total_likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => handleCommentPress(post.id)}
        >
          <Icon name="chatbubble-outline" size={20} color="#7DC8FF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleRepost(post)}
          style={styles.likeButton}
        >
          <Icon name="repeat-outline" size={20} color="#7DC8FF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSharePress(post)}
          style={styles.likeButton}
        >
          <Icon name="paper-plane-outline" size={20} color="#7DC8FF" />
        </TouchableOpacity>
      </View>
      <ShareModal
        visible={shareModalVisible === post.id} // Only open for the correct post
        onClose={() => setShareModalVisible(null)}
        postContent={post.content || "Check out this post!"}
      />
      {/* Repost Modal */}
      {selectedPost && selectedPost.id === post.id && (
        <RepostModal
          showRepostModal={showRepostModal}
          setShowRepostModal={setShowRepostModal}
          selectedPost={selectedPost}
          use={use}
          setUse={setUse}
          navigation={navigation}
        />
      )}
      <Report3Dot
        isVisible={reportModalVisible === post.id} // Show only for selected post
        onClose={() => setReportModalVisible(false)}
        onSubmit={() => handleReportPost(post.id)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.postsSection}>
        <Text style={styles.sectionTitle}>Contributions</Text>
        {userInfo?.posts ? (
          userInfo.posts.map((post) => (
            <View key={`post-${post.id}`}>{renderPost(post)}</View>
          ))
        ) : (
          <Text>No post to show!</Text>
        )}
      </View>

      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
      <RepostModal
        showRepostModal={showRepostModal}
        setShowRepostModal={setShowRepostModal}
        selectedPost={selectedPost}
        use={use}
        setUse={setUse}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  postsSection: {
    paddingVertical: 20,
    paddingHorizontal: 13,
  },
  postItem: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  postAuthorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  HostProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginLeft: -10,
  },
  postAuthorName: {
    fontSize: 16,
    fontFamily: "Figtree-Bold",
  },
  postUserId: {
    fontSize: 12,
    marginTop: 3,
    color: "#666",
    fontFamily: "Figtree-Regular",
  },
  postTextSection: {
    marginBottom: 17,
  },
  postTitle: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Figtree-Bold",
  },
  postContent: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Figtree-Regular",
    marginTop: 10,
  },
  moreButton: {
    fontSize: 20,
    color: "#666",
    paddingHorizontal: 10,
  },
  imageScrollView: {
    flexGrow: 0,
    borderRadius: 12,
  },
  postImage: {
    width: 300,
    height: 200,
    resizeMode: "cover",
    marginRight: 8,
    borderRadius: 12,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    marginTop: 15,
    width: "80%",
    gap: 16,
    borderRadius: 100,
    // backgroundColor: "#CEEAFF",
    backgroundColor: "rgba(236, 247, 255, 0.8)",
  },
  actionButton: {
    width: 70,
    height: 30,
    borderRadius: 100,
    padding: 4,
    backgroundColor: "#fff",
  },
  likeButton: {
    borderRadius: 100,
    padding: 4,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
  underline: {
    width: 50,
    height: 2,
    backgroundColor: "#97D3FF",
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Figtree-Bold",
    marginBottom: 10,
  },
  actionText: {
    color: "#666",
  },
});

export default HostContributions;
