import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import {
  MaterialIcons,
  Feather,
  FontAwesome5,
  FontAwesome,
} from "@expo/vector-icons";
import RepostModal from "../RepostCreation/RepostModal";
import { formatDate } from "../../../func/basicFunc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../../../constant/BaseConst";
import Toast from "../../../components/Toast/Toast";
import Post3dots from "../../../components/post/Post3Dots";
import ShareModal from "../../../components/ShareModal/ShareModal";
import DummyProfile from "../../../assets/DummyImage/DummyProfile.png";

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = width - 32;

const RepostCard = ({ item, index, totalItems, fadeAnim }) => {
  const navigation = useNavigation();
  const [liked, setLiked] = useState(item.is_liked);
  const [likesCount, setLikesCount] = useState(item.total_likes);

  const handleLike = async () => {
    const previousState = { liked, likesCount };

    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));

    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.post(
        `${BASE_URL}/api/posts/${item.id}/like-post/`,
        null,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (response.data?.message === "Liked") {
        setLiked(true);
      } else if (response.data?.message?.toLowerCase() === "unliked") {
        setLiked(false);
      }
    } catch (error) {
      console.error("Error updating like:", error.message);
      setLiked(previousState.liked);
      setLikesCount(previousState.likesCount);
    }
  };

  // Calculate styles based on position
  const getCardStyle = () => {
    if (index === 0) {
      // First card - centered
      return {
        transform: [{ translateY: 0 }],
        zIndex: 3,
        opacity: fadeAnim || 1, // Use fade animation if provided
      };
    } else if (index === 1) {
      // Second card - slightly angled and blurred
      return {
        transform: [{ rotate: "-5deg" }, { translateY: -20 }],
        zIndex: 2,
        opacity: 0.7,
        position: "absolute",
        top: 30,
        left: 10,
      };
    } else if (index === 2) {
      // Third card - opposite angle and more blurred
      return {
        transform: [{ rotate: "5deg" }, { translateY: -20 }],
        zIndex: 1,
        opacity: 0.5,
        position: "absolute",
        top: 30,
        right: 10,
      };
    }
    // For other cards, hide them (you can adjust this if you want to show more)
    return {
      display: "none",
    };
  };

  return (
    <Animated.View style={[styles.repostCard, getCardStyle()]}>
      <View style={styles.userInfo}>
        <Image
          source={{
            uri:
              typeof item?.user?.image === "string"
                ? item.user.image
                : DummyProfile,
          }}
          style={styles.avatar}
          contentFit="cover"
        />
        <View>
          <Text style={styles.name} numberOfLines={1}>
            {item.user.display_name ||
              `${item.user.first_name} ${item.user.last_name}`}
          </Text>
          <Text style={styles.username} numberOfLines={1}>
            @{item.user.username.split("@")[0]} ·{" "}
            {formatDate(item.date_created)}
          </Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.content} numberOfLines={2}>
        {item.content}
      </Text>

      {item.images?.[0]?.image && (
        <Image
          source={{ uri: item.images[0].image }}
          style={styles.mainImage}
          contentFit="cover"
        />
      )}

      <View style={styles.actionsContainer}>
        <Pressable style={styles.actionButton} onPress={handleLike}>
          {liked ? (
            <FontAwesome name="heart" size={20} color="#FF0000" />
          ) : (
            <Feather name="heart" size={20} color="#657786" />
          )}
          <Text style={[styles.actionText, liked && styles.likedText]}>
            {likesCount >= 1000
              ? (likesCount / 1000).toFixed(likesCount % 1000 === 0 ? 0 : 1) +
                "K"
              : likesCount}
          </Text>
        </Pressable>

        <Pressable style={styles.actionButton}>
          <FontAwesome5 name="comment" size={18} color="#657786" />
          <Text style={styles.actionText}>
            {item.total_comments >= 1000
              ? (item.total_comments / 1000).toFixed(
                  item.total_comments % 1000 === 0 ? 0 : 1
                ) + "K"
              : item.total_comments}
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const RepostsContainer = ({ currentPost }) => {
  const [repostData, setRepostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  const getReposts = async (postId) => {
    if (!postId) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(
        `${BASE_URL}/api/feed/${postId}/get-reposts/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (response.data) {
        setRepostData(response.data.results || []);

        // Start fade animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }
    } catch (error) {
      console.error("Error fetching reposts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPost?.thread) {
      // Reset fade animation when new post loads
      fadeAnim.setValue(0);

      // Delay the repost loading by 1s for animation effect
      const timer = setTimeout(() => {
        getReposts(currentPost.thread);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentPost?.thread]);

  return (
    <View style={styles.repostsContainer}>
      {/* Repost header */}
      <View style={styles.repostedHeader}>
        <View style={styles.repostedAvatars}>
          {repostData.slice(0, 3).map((repost, index) => (
            <Image
              key={index}
              source={{
                uri:
                  typeof repost.user?.image === "string"
                    ? repost.user.image
                    : DummyProfile,
              }}
              style={[
                styles.repostedAvatar,
                { marginLeft: index === 0 ? 0 : -10 },
              ]}
              contentFit="cover"
            />
          ))}
        </View>
        <Text style={styles.repostedText}>
          {repostData.length > 3 && `+${repostData.length - 3} `}
          {repostData.length === 1 ? "Repost" : "Reposts"}
        </Text>
      </View>

      {/* Repost cards */}
      <View style={styles.repostsCardsContainer}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#1DA1F2"
            style={styles.loader}
          />
        ) : repostData.length > 0 ? (
          repostData.map((item, index) => (
            <RepostCard
              key={item.id}
              item={item}
              index={index}
              totalItems={repostData.length}
              fadeAnim={index === 0 ? fadeAnim : null}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="repeat" size={40} color="#E1E8ED" />
            <Text style={styles.emptyStateText}>No reposts yet</Text>
            <Text style={styles.emptyStateSubText}>
              Be the first to share this post
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  repostsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  repostedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  repostedAvatars: {
    flexDirection: "row",
    marginRight: 10,
  },
  repostedAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "white",
  },
  repostedText: {
    fontSize: 14,
    color: "#657786",
    fontWeight: "500",
  },
  repostsCardsContainer: {
    height: 300, // Fixed height to contain the stacked cards
    position: "relative",
    marginBottom: 20,
  },
  repostCard: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignSelf: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#14171A",
  },
  username: {
    fontSize: 13,
    color: "#657786",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#14171A",
    marginBottom: 8,
  },
  content: {
    fontSize: 15,
    color: "#14171A",
    marginBottom: 12,
    lineHeight: 20,
  },
  mainImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: "#E1E8ED",
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#E1E8ED",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#657786",
  },
  likedText: {
    color: "#FF0000",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#657786",
    marginTop: 8,
    fontWeight: "600",
  },
  emptyStateSubText: {
    fontSize: 14,
    color: "#AAB8C2",
    marginTop: 4,
  },
  loader: {
    marginVertical: 20,
  },
});

export default RepostsContainer;
