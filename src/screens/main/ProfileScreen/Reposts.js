import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import React, { useState, useRef } from "react";
import { Image } from "expo-image";
import HeartIcon from "../../../components/buttons/FeedIcons/Post_Icons/HeartIcon";
import HeartSelected from "../../../components/buttons/FeedIcons/Post_Icons/HeartSelected";
import Comment from "../../../components/buttons/FeedIcons/Post_Icons/Comment";
import RepostIcon from "../../../components/buttons/FeedIcons/Post_Icons/Repost";
import ShareIcon from "../../../components/buttons/FeedIcons/Post_Icons/Share";
import {
  GestureHandlerRootView,
  FlatList as GHFlatList,
} from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import ShareModal from "../../../components/ShareModal/ShareModal";
import RepostModal from "../RepostCreation/RepostModal";
import { formatDate } from "../../../func/basicFunc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../../constant/BaseConst";
import axios from "axios";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width - 32;

const Repost = ({ data }) => {
  const {
    total_likes = 0,
    is_liked = false,

    enable_comment = false,
  } = data || {};
  const navigation = useNavigation();
  const [isLiked, setIsLiked] = useState(false);
  const [liked, setLiked] = useState(is_liked);
  const [likesCount, setLikesCount] = useState(total_likes);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const flatListRef = useRef(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRepostModal, setShowRepostModal] = useState(false);
  const [use, setUse] = useState("Gallery");

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems[0]?.index !== undefined) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const handlePostPress = () => {
    navigation.navigate("PostDetails", { post: { ...data } });
  };

  const handleCommentPress = () => {
    navigation.navigate("CommentModal", {
      postId: data.id,
    });
  };

  const handleSharePress = () => {
    setShowShareModal(true);
  };

  const handleRepostPress = () => {
    setShowRepostModal(true);
  };
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
        `${BASE_URL}/api/posts/${data.id}/like-post/`,
        null,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (response.data) {
        console.log(data.id, response.data, data.total_likes);
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

  const defaultUserImg = "https://randomuser.me/api/portraits/women/40.jpg";
  // console.log(data);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: data?.user?.image || defaultUserImg }}
          style={styles.avatar}
          contentFit="cover"
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>
            {data?.user?.display_name
              ? data?.user?.display_name
              : `${data?.user?.first_name} ${data.user?.last_name}`}
          </Text>
          <View style={styles.usernameTimeContainer}>
            <Text style={styles.timeAgo}>@{data?.user?.username}</Text>
            <View style={styles.dotSeparator} />
            <Text style={styles.timeAgo}>{formatDate(data.date_created)}</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.contentTitle}>{data.title}</Text>
        <Pressable onPress={toggleDescription}>
          <View>
            <Text
              style={styles.contentDescription}
              numberOfLines={isDescriptionExpanded ? undefined : 2}
            >
              {data.content}
            </Text>
            {!isDescriptionExpanded && data.content?.length > 80 && (
              <Text style={styles.readMore}>Read More</Text>
            )}
          </View>
        </Pressable>

        {/* Image Carousel */}
        <Pressable onPress={handlePostPress}>
          <GestureHandlerRootView style={styles.carouselContainer}>
            {data.images && (
              <GHFlatList
                ref={flatListRef}
                data={data.images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={ITEM_WIDTH}
                snapToAlignment="start"
                decelerationRate="fast"
                onViewableItemsChanged={handleViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                renderItem={({ item }) => (
                  <View style={styles.imageWrapper}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.carouselImage}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        transition={200}
                      />
                    </View>
                  </View>
                )}
                keyExtractor={(_, index) => index.toString()}
                initialNumToRender={1}
                maxToRenderPerBatch={2}
                windowSize={3}
                removeClippedSubviews={true}
                contentContainerStyle={{ borderRadius: 12 }}
                style={{ borderRadius: 12 }}
              />
            )}

            {/* Image Counter */}
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {activeIndex + 1}/{data.images?.length}
              </Text>
            </View>

            {/* Pagination Dots */}
            <View style={styles.paginationDots}>
              {data.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        index === activeIndex ? "#87CEEB" : "#4A4A4A",
                      opacity: index === activeIndex ? 1 : 0.5,
                    },
                  ]}
                />
              ))}
            </View>
          </GestureHandlerRootView>
        </Pressable>
      </View>

      {/* Interaction Stats */}
      <View style={styles.stats}>
        <View style={styles.leftStats}>
          <Pressable style={styles.statButton} onPress={handleLike}>
            {liked ? <HeartSelected /> : <HeartIcon />}
            <Text style={[styles.statText, liked && styles.statTextLiked]}>
              {likesCount >= 1000
                ? (likesCount / 1000).toFixed(likesCount % 1000 === 0 ? 0 : 1) +
                  "K"
                : likesCount}
            </Text>
          </Pressable>

          <Pressable style={styles.statButton} onPress={handleCommentPress}>
            <Comment />
            <Text style={styles.statText}>
              {" "}
              {data.total_comments >= 1000
                ? (data.total_comments / 1000).toFixed(
                    data.total_comments % 1000 === 0 ? 0 : 1
                  ) + "K"
                : data.total_comments}
            </Text>
          </Pressable>

          <Pressable style={styles.statButton} onPress={handleRepostPress}>
            <RepostIcon />
            <Text style={styles.statText}>
              {" "}
              {data.total_reposts >= 1000
                ? (data.total_reposts / 1000).toFixed(
                    data.total_reposts % 1000 === 0 ? 0 : 1
                  ) + "K"
                : data.total_reposts}
            </Text>
          </Pressable>
        </View>

        <Pressable style={styles.shareButton} onPress={handleSharePress}>
          <ShareIcon />
        </Pressable>
      </View>
      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        postContent={data.description}
      />

      <RepostModal
        showRepostModal={showRepostModal}
        setShowRepostModal={setShowRepostModal}
        selectedPost={data}
        use={use}
        setUse={setUse}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingTop: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 10,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userInfo: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#14171A",
  },
  usernameTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  timeAgo: {
    fontSize: 14,
    color: "#657786",
  },
  dotSeparator: {
    width: 5,
    height: 5,
    borderRadius: 2,
    backgroundColor: "#D9D9D9",
    marginHorizontal: 6,
  },
  content: {
    marginBottom: 8,
    paddingLeft: 2,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#14171A",
    marginBottom: 8,
    lineHeight: 22,
  },
  contentDescription: {
    fontSize: 15,
    color: "#14171A",
    lineHeight: 20,
    marginBottom: 4,
  },
  readMore: {
    fontSize: 15,
    color: "#666666",
    lineHeight: 20,
  },
  carouselContainer: {
    marginTop: 5,
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F5F8FA",
  },
  imageWrapper: {
    width: ITEM_WIDTH,
    height: 200,
    overflow: "hidden",
    borderRadius: 12,
  },
  imageContainer: {
    flex: 1,
    margin: 0,
    borderRadius: 12,
    overflow: "hidden",
  },
  carouselImage: {
    width: ITEM_WIDTH,
    height: "100%",
    borderRadius: 12,
  },
  imageCounter: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCounterText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  paginationDots: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 0,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingVertical: 4,
    marginBottom: 4,
  },
  leftStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingLeft: 8,
  },
  statButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 4,
  },
  shareButton: {
    padding: 4,
  },
  statText: {
    marginLeft: 6,
    color: "#657786",
    fontSize: 14,
  },
  statTextLiked: {
    color: "#1DA1F2",
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.2)",
    alignSelf: "center",
    marginVertical: 12,
  },
});

//dummy Reposts component
const Reposts = ({ reposts }) => {
  const dummyReposts = [
    {
      id: "1",
      user: {
        name: "Sarah Anderson",
        username: "sarahander",
        avatar: require("../../../assets/ProfileScreenImages/Profile.jpg"),
        timeAgo: "2h ago",
      },
      content: {
        title: "Photography Tips for Beginners 📸",
        description:
          "Reposting these amazing tips that helped me when I was starting out. Great advice for anyone beginning their photography journey!",
        images: [
          "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800",
          "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800",
        ],
      },
      stats: {
        likes: "1.5K",
        comments: "156",
      },
    },
    {
      id: "2",
      user: {
        name: "Sarah Anderson",
        username: "sarahander",
        avatar: require("../../../assets/ProfileScreenImages/Profile.jpg"),
        timeAgo: "1d ago",
      },
      content: {
        title: "Essential Camera Settings ⚙️",
        description:
          "These camera settings are game-changers! Sharing this helpful guide that transformed my photography. Must-read for photography enthusiasts!",
        images: [
          "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800",
          "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800",
        ],
      },
      stats: {
        likes: "2.3K",
        comments: "245",
      },
    },
  ];

  return (
    <View style={{ flex: 1, marginHorizontal: 15, marginVertical: 5 }}>
      {reposts ? (
        reposts?.map((post) => <Repost key={post.id} data={post} />)
      ) : (
        <Text>No Reposts to show!</Text>
      )}
    </View>
  );
};

export default Reposts;
