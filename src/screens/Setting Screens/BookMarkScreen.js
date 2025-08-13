import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
  Modal,
  Platform,
  StatusBar,
} from "react-native";
import {
  Ionicons,
  Entypo,
  FontAwesome5,
  FontAwesome6,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
//import Post from "../../components/post/Post";
import PostHeader from "../../components/post/PostHeader";
import RepostModal from "../main/RepostCreation/RepostModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../constant/BaseConst";
import Post from "../main/FeedPost/Post";
import axios from "axios";

const BookMarkScreen = () => {
  const navigation = useNavigation();
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showRepostModal, setShowRepostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [use, setUse] = useState("AI"); // Default selection
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  const fetchBookmarkLists = async () => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await fetch(`${BASE_URL}/api/post-bookmarks/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      const result = await response.json();
      console.log(result.results[0].post.user);
      if (response.ok) {
        setBookmarkedPosts(result.results);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // Simulate loading
  useEffect(() => {
    fetchBookmarkLists();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // Handle post actions
  const handleShare = (post) => {
    // Navigate to share modal or implement share functionality
    console.log("Share post:", post.id);
    navigation.navigate("ShareModal", { postContent: post.content });
  };

  const handleComment = (post) => {
    // Navigate to comment screen
    console.log("Comment on post:", post.id);
    navigation.navigate("CommentModal", { postId: post.id });
  };

  const handleRepost = (post) => {
    // Show repost modal
    setSelectedPost(post);
    setShowRepostModal(true);
  };

  const handleRemoveBookmark = async (postId) => {
    const token = await AsyncStorage.getItem("authToken");
    console.log(postId);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/post-bookmarks/`,
        { post: postId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      console.log(response.data);

      if (response.status === 201) {
        console.log("Post Bookmarked:", postId);
        //  showToast(`Post Bookmarked: ${response.data.post}`);

        // setAlertConfig({
        //   visible: true,
        //   type: "success",
        //   message: `You reported the post Id: ${response.data.post}`,
        // });
      }

      if (response.status === 200) {
        console.log("Post unBookmarked:", postId);
        setBookmarkedPosts((prevPosts) =>
          prevPosts.filter((post) => post.id !== postId)
        );
        //showToast(`${response.data.message}: ${postId}`);
      }
    } catch (error) {
      console.error("Error generating bookmark:", error);
      showToast("Already bookmarked!");
    }
    // console.log("Bookmarked post:", postId);
  };

  // Handle removing a bookmark
  // const handleRemoveBookmark = (postId) => {
  //   // Remove the post from the list
  //   setBookmarkedPosts((prevPosts) =>
  //     prevPosts.filter((post) => post.id !== postId)
  //   );
  // };

  // Update post data (e.g., after liking)
  const handleUpdatePost = (postId, newData) => {
    setBookmarkedPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, ...newData } : post
      )
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bookmark-outline" size={100} color="#E0E0E0" />
      <Text style={styles.emptyTitle}>No bookmarks yet</Text>
      <Text style={styles.emptyText}>
        Save posts you'd like to revisit by tapping the bookmark icon
      </Text>
    </View>
  );

  // Render each post item
  const renderPostItem = ({ item }) => (
    // <View
    //   style={[
    //     styles.postItemContainer,
    //     {
    //       height: scrollViewHeight,
    //     },
    //   ]}
    // >
    <>
      <Post
        data={item.post}
        handleShare={() => handleShare(item)}
        handleComment={() => handleComment(item.post)}
        handleRepost={() => handleRepost(item.post)}
        onUpdatePost={(newData) => handleUpdatePost(item.post.id, newData)}
        showDetails={true}
        setScrollViewHeight={setScrollViewHeight}
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveBookmark(item.post.id)}
      >
        <Ionicons name="bookmark" size={24} color="black" />
      </TouchableOpacity>
    </>
    //

    // </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bookmarks</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1877f2" />
          </View>
        ) : bookmarkedPosts?.length > 0 ? (
          <FlatList
            data={bookmarkedPosts}
            renderItem={renderPostItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#1877f2"]}
                tintColor="#1877f2"
              />
            }
          />
        ) : (
          renderEmptyState()
        )}
      </View>

      {/* Repost Modal */}
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f5",
    backgroundColor: "#fff",
    //ddingTop:23,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Figtree-Bold",
    color: "#000",
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexGrow: 1,
    paddingTop: 20,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: -100, // This will help center the content better
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Figtree-Bold",
    color: "#333333",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
    fontFamily: "Figtree-Regular",
    lineHeight: 20,
    maxWidth: "80%",
  },
  postItemContainer: {
    position: "relative",
    marginBottom: 20,
    marginTop: 10,
  },
  removeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 8,
    zIndex: 999,
    shadowColor: "#333",
    shadowOpacity: 0.9,
    elevation: 5,
  },

  // Modal Styles - Exact copy from HomeScreen
  centeredView: {
    bottom: 0,
  },
  modalView: {
    margin: 3,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    top: 130,
    position: "absolute",
    bottom: -40,
    left: -10,
    right: -10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  singleImage: {
    width: "100%",
    borderRadius: 15,
    aspectRatio: 1 / 0.9,
    backgroundColor: "#c8c8c8",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallText: {
    fontFamily: "Figtree-Regular",
    fontSize: 12,
    paddingTop: 8,
  },
  hookContainer2: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    top: 150,
    right: 10,
    position: "absolute",
  },
});

export default BookMarkScreen;
