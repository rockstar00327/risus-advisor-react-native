import axios from "axios";
import {
  withTiming,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
//import { BACKEND_API_ENDPOINT } from "@env";
import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import CommentImg from "../../assets/icons/black-comment.svg";
import SendImg from "../../assets/icons/send-black.svg";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../constant/BaseConst";
import ShareModal from "../ShareModal/ShareModal";

const ActionButtons = ({ post, handleShare, handleComment, onUpdatePost }) => {
  const navigation = useNavigation();
  const {
    total_likes = 0,
    is_liked = false,
    enable_comment = false,
  } = post || {};

  const translateText = useSharedValue(0);
  const translateIcon = useSharedValue(0);
  const [rowWidth, setRowWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const [liked, setLiked] = useState(is_liked);
  const [likesCount, setLikesCount] = useState(total_likes);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  useEffect(() => {
    // Move in opposite directions when toggling like
    translateIcon.value = withTiming(liked ? rowWidth - 29 : 0, {
      duration: 300,
    });
    translateText.value = withTiming(liked ? -rowWidth + textWidth + 4 : 0, {
      duration: 300,
    });
  }, [liked, rowWidth, textWidth]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateIcon.value }],
  }));

  const animatedCountStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateText.value }],
  }));

  const handleLike = async () => {
    const previousState = { liked, likesCount }; // Save for rollback in case of API failure

    // Optimistically update UI using functional state update
    setLiked((prevLiked) => !prevLiked);
    setLikesCount((prevLikes) =>
      liked ? Math.max(prevLikes - 1, 0) : prevLikes + 1
    );

    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.post(
        `${BASE_URL}/api/posts/${post.id}/like-post/`,
        null,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (response.data) {
        console.log(post.id, response.data, post.total_likes);
        if (response.data.message === "Liked") {
          setLiked(true);
          // setLikesCount((prev) => prev + 1);
        } else if (response.data.message?.toLowerCase() === "unliked") {
          setLiked(false);
          //setLikesCount((prev) => Math.max(prev - 1, 0));
        }
      }
    } catch (error) {
      console.error("Error updating like:", error.message);

      // Revert UI changes if API fails
      setLiked(previousState.liked);
      setLikesCount(previousState.likesCount);
    }
  };

  // New function to handle comment button press
  const handleCommentPress = () => {
    console.log("comment pressed");
    // Navigate to the CommentModal screen
    navigation.navigate("CommentModal", { postId: post?.id });
  };

  // New function to handle share button press
  const handleSharePress = () => {
    console.log("share pressed");
    setShareModalVisible(true);
  };

  return (
    <View style={styles.btnsContainer}>
      <Pressable
        style={styles.row}
        onPress={handleLike}
        disabled={!handleLike}
        onLayout={(event) => setRowWidth(event.nativeEvent.layout.width)}
      >
        <View style={[styles.iconWrapper]}>
          {liked ? (
            <AntDesign name="heart" size={26} color="#CEEAFF" />
          ) : (
            <AntDesign name="hearto" size={26} color="black" />
          )}
        </View>
        <Text style={[styles.likesCount]}>
          {likesCount >= 1000
            ? (likesCount / 1000).toFixed(likesCount % 1000 === 0 ? 0 : 1) + "K"
            : likesCount}
        </Text>
      </Pressable>
      <Pressable
        style={styles.row}
        onPress={handleCommentPress}
        disabled={!enable_comment}
      >
        <CommentImg style={{ width: 44, height: 44, marginLeft: 10 }} />
        <Text style={[styles.likesCount]}>
          {post?.highlighted_comment?.length >= 1000
            ? (post?.highlighted_comment?.length / 1000).toFixed(
                post?.highlighted_comment?.length % 1000 === 0 ? 0 : 1
              ) + "K"
            : post?.highlighted_comment?.length}
        </Text>
      </Pressable>
      <Pressable onPress={handleSharePress}>
        <SendImg style={{ width: 24, height: 24, marginLeft: 10 }} />
      </Pressable>

      <ShareModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        postContent={post?.content || "Check out this post!"}
      />
    </View>
  );
};

export default React.memo(ActionButtons);

const styles = StyleSheet.create({
  btnsContainer: {
    //gap: 5,
    paddingHorizontal: 4,
    //overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "rgba(241, 243, 255, 1)",
    paddingTop: 15,
    marginLeft: 10,
  },
  row: {
    gap: 3,
    padding: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    //height: 30,
    // backgroundColor: "#F1F3FF",
  },

  likesCount: {
    paddingHorizontal: 2,
    fontFamily: "Figtree-Regular",
    color: "#000",
  },
});
