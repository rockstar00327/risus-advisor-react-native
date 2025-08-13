"use client";

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Image } from "expo-image";
import {
  GestureHandlerRootView,
  FlatList as GHFlatList,
} from "react-native-gesture-handler";
import {
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formatDate } from "../../../func/basicFunc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../../../constant/BaseConst";
import DummyProfile from "../../../assets/DummyImage/DummyProfile.png";

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = width - 32;
const MINI_POST_HEIGHT = 120;
const FULL_POST_HEIGHT = 519;

const EnhancedPost = ({
  data,
  reposts = [],
  isActive,
  isViewingReposts,
  selectedRepostIndex,
  onRepostScroll,
  onRepostSelect,
}) => {
  const navigation = useNavigation();
  const [liked, setLiked] = useState(data?.is_liked || false);
  const [likesCount, setLikesCount] = useState(data?.total_likes || 0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showRepostsList, setShowRepostsList] = useState(false);

  const flatListRef = useRef(null);
  const repostsListRef = useRef(null);
  const postHeightAnim = useRef(new Animated.Value(FULL_POST_HEIGHT)).current;
  const repostsOpacityAnim = useRef(new Animated.Value(0)).current;

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) return null;
        const { data: userData } = await axios.get(
          `${BASE_URL}/api/user/profile/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    getCurrentUser();
  }, []);

  // Handle post size animation
  useEffect(() => {
    if (!isActive) return;

    if (isViewingReposts) {
      // Shrink main post and show reposts
      Animated.parallel([
        Animated.timing(postHeightAnim, {
          toValue: MINI_POST_HEIGHT,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(repostsOpacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
      setShowRepostsList(true);
    } else {
      // Expand main post and hide reposts
      Animated.parallel([
        Animated.timing(postHeightAnim, {
          toValue: FULL_POST_HEIGHT,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(repostsOpacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => {
        if (!isViewingReposts) {
          setShowRepostsList(false);
        }
      });
    }
  }, [isViewingReposts, isActive]);

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems[0]?.index !== undefined) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleLike = async () => {
    const previousState = { liked, likesCount };
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
        if (response.data.message === "Liked") {
          setLiked(true);
        } else if (response.data.message?.toLowerCase() === "unliked") {
          setLiked(false);
        }
      }
    } catch (error) {
      console.error("Error updating like:", error.message);
      setLiked(previousState.liked);
      setLikesCount(previousState.likesCount);
    }
  };

  const handleSwipeUp = () => {
    if (reposts.length > 0) {
      onRepostScroll(true);
    }
  };

  const handleRepostPress = (repost, index) => {
    onRepostSelect(index);
  };

  const renderRepostItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.repostItem}
      onPress={() => handleRepostPress(item, index)}
      activeOpacity={0.9}
    >
      <View style={styles.repostHeader}>
        <Image
          source={{
            uri:
              typeof item.user?.image === "string"
                ? item.user.image
                : DummyProfile,
          }}
          style={styles.repostAvatar}
          contentFit="cover"
        />
        <View style={styles.repostUserInfo}>
          <Text style={styles.repostName}>
            {item.user?.display_name ||
              `${item.user?.first_name} ${item.user?.last_name}`}
          </Text>
          <Text style={styles.repostUsername}>
            @{item.user?.username?.split("@")[0]} •{" "}
            {formatDate(item.date_created)}
          </Text>
        </View>
      </View>

      {item.images && item.images.length > 0 && (
        <Image
          source={{ uri: item.images[0].image }}
          style={styles.repostImage}
          contentFit="cover"
        />
      )}

      <Text style={styles.repostContent} numberOfLines={3}>
        {item.content}
      </Text>

      <View style={styles.repostStats}>
        <View style={styles.repostStatItem}>
          <FontAwesome name="heart" size={16} color="#657786" />
          <Text style={styles.repostStatText}>{item.total_likes}</Text>
        </View>
        <View style={styles.repostStatItem}>
          <FontAwesome5 name="comment" size={16} color="#657786" />
          <Text style={styles.repostStatText}>{item.total_comments}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const currentDisplayData =
    selectedRepostIndex >= 0 ? reposts[selectedRepostIndex] : data;

  if (!isActive) {
    return <View style={[styles.container, { opacity: 0.3 }]} />;
  }

  return (
    <View style={styles.wrapper}>
      {/* Main Post */}
      <Animated.View style={[styles.container, { height: postHeightAnim }]}>
        {currentDisplayData?.images &&
          Array.isArray(currentDisplayData.images) &&
          currentDisplayData.images.length > 0 && (
            <GestureHandlerRootView style={styles.carouselContainer}>
              <GHFlatList
                ref={flatListRef}
                data={currentDisplayData.images}
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
                        source={{
                          uri:
                            typeof item?.image === "string" ? item.image : null,
                        }}
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
              />

              {/* Header */}
              <View style={styles.headerOverlay}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("HostProfile", {
                      user: currentDisplayData?.user,
                    })
                  }
                  style={styles.header}
                >
                  <Image
                    source={{
                      uri:
                        typeof currentDisplayData?.user?.image === "string"
                          ? currentDisplayData.user?.image
                          : DummyProfile,
                    }}
                    style={styles.avatar}
                    contentFit="cover"
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.name}>
                      {currentDisplayData.user?.display_name
                        ? currentDisplayData.user?.display_name
                        : `${currentDisplayData.user?.first_name} ${currentDisplayData.user?.last_name}`}
                    </Text>
                    <View style={styles.usernameTimeContainer}>
                      <Text style={styles.timeAgo}>
                        @{currentDisplayData.user?.username?.split("@")[0]}
                      </Text>
                      <View style={styles.dotSeparator} />
                      <Text style={styles.timeAgo}>
                        {formatDate(currentDisplayData.date_created)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Content and Actions */}
              <View style={styles.bottomOverlay}>
                <View style={styles.contentSection}>
                  <Text style={styles.contentTitle}>
                    {currentDisplayData.title}
                  </Text>
                  <Text
                    style={styles.contentDescription}
                    numberOfLines={isViewingReposts ? 1 : 2}
                  >
                    {currentDisplayData.content}
                  </Text>
                </View>

                <View style={styles.actionsSection}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleLike}
                  >
                    {liked ? (
                      <FontAwesome name="heart" size={24} color="#1DA1F2" />
                    ) : (
                      <Feather
                        name="heart"
                        size={24}
                        color="#fff"
                        style={styles.textsShadows}
                      />
                    )}
                    <Text
                      style={[
                        styles.actionText,
                        liked && styles.actionTextLiked,
                      ]}
                    >
                      {likesCount >= 1000
                        ? (likesCount / 1000).toFixed(1) + "K"
                        : likesCount}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    <FontAwesome5
                      name="comment"
                      size={24}
                      color="#fff"
                      style={styles.textsShadows}
                    />
                    <Text style={styles.actionText}>
                      {currentDisplayData.total_comments}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    <Feather
                      name="send"
                      size={24}
                      color="#fff"
                      style={styles.textsShadows}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Swipe Up Indicator */}
              {!isViewingReposts && reposts.length > 0 && (
                <TouchableOpacity
                  style={styles.swipeUpIndicator}
                  onPress={handleSwipeUp}
                >
                  <View style={styles.repostAvatars}>
                    {reposts.slice(0, 3).map((repost, index) => (
                      <Image
                        key={index}
                        source={{
                          uri:
                            typeof repost.user?.image === "string"
                              ? repost.user.image
                              : DummyProfile,
                        }}
                        style={[
                          styles.miniAvatar,
                          { marginLeft: index === 0 ? 0 : -8 },
                        ]}
                        contentFit="cover"
                      />
                    ))}
                  </View>
                  <Text style={styles.repostCount}>
                    {reposts.length} x {Math.floor(Math.random() * 600) + 400}{" "}
                    {reposts.length > 1 ? "more reposted" : "reposted"}
                  </Text>
                  <View style={styles.swipeUpArrow}>
                    <MaterialIcons
                      name="keyboard-arrow-up"
                      size={20}
                      color="#fff"
                    />
                    <Text style={styles.swipeUpText}>
                      Swipe Up to see the reposts
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </GestureHandlerRootView>
          )}
      </Animated.View>

      {/* Reposts List */}
      {showRepostsList && (
        <Animated.View
          style={[styles.repostsContainer, { opacity: repostsOpacityAnim }]}
        >
          <FlatList
            ref={repostsListRef}
            data={reposts}
            renderItem={renderRepostItem}
            keyExtractor={(item, index) => `repost-${item.id}-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.repostsContent}
            onScrollBeginDrag={() => onRepostScroll(true)}
            onScrollEndDrag={() => {
              // Optional: You can add logic here to hide reposts when scroll ends
            }}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: width - 32,
    marginHorizontal: 16,
  },
  container: {
    backgroundColor: "gray",
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  carouselContainer: {
    flex: 1,
    borderRadius: 12,
  },
  imageWrapper: {
    width: ITEM_WIDTH,
    overflow: "hidden",
  },
  imageContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  carouselImage: {
    width: ITEM_WIDTH,
    height: "100%",
  },
  headerOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
    color: "#fff",
    textShadowColor: "#14171A",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 7,
  },
  usernameTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  timeAgo: {
    fontSize: 14,
    color: "#fff",
    textShadowColor: "#14171A",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 7,
  },
  dotSeparator: {
    width: 5,
    height: 5,
    borderRadius: 2,
    backgroundColor: "#D9D9D9",
    marginHorizontal: 6,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  contentSection: {
    flex: 1,
    marginRight: 10,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "#14171A",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 7,
    marginBottom: 4,
  },
  contentDescription: {
    fontSize: 15,
    color: "#fff",
    textShadowColor: "#14171A",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 7,
    lineHeight: 20,
  },
  actionsSection: {
    alignItems: "center",
    gap: 15,
  },
  actionButton: {
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    textShadowColor: "#14171A",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 7,
    fontSize: 14,
    marginTop: 4,
  },
  actionTextLiked: {
    color: "#1DA1F2",
  },
  textsShadows: {
    textShadowColor: "#14171A",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 7,
  },
  swipeUpIndicator: {
    position: "absolute",
    bottom: 60,
    left: 10,
    right: 10,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 8,
    padding: 8,
  },
  repostAvatars: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
  },
  repostCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  swipeUpArrow: {
    alignItems: "center",
  },
  swipeUpText: {
    color: "#fff",
    fontSize: 10,
  },
  repostsContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    marginTop: 8,
    borderRadius: 12,
  },
  repostsContent: {
    padding: 16,
  },
  repostItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  repostHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  repostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  repostUserInfo: {
    marginLeft: 12,
    flex: 1,
  },
  repostName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#14171A",
  },
  repostUsername: {
    fontSize: 14,
    color: "#657786",
    marginTop: 2,
  },
  repostImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  repostContent: {
    fontSize: 15,
    color: "#14171A",
    lineHeight: 20,
    marginBottom: 12,
  },
  repostStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  repostStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  repostStatText: {
    fontSize: 14,
    color: "#657786",
  },
});

export default React.memo(EnhancedPost);
