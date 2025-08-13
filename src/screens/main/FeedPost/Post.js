"use client";

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Image } from "expo-image";
import RepostIcon from "../../../components/buttons/FeedIcons/Post_Icons/Repost";
import {
  GestureHandlerRootView,
  FlatList as GHFlatList,
  ScrollView,
} from "react-native-gesture-handler";
import {
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ShareModal from "../../../components/ShareModal/ShareModal";
import RepostModal from "../RepostCreation/RepostModal";
import { formatDate } from "../../../func/basicFunc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../../../constant/BaseConst";
import { ActivityIndicator } from "react-native";
import DummyProfile from "../../../assets/DummyImage/DummyProfile.png";
import Post3dots from "../../../components/post/Post3Dots";
import Toast from "../../../components/Toast/Toast";
import BlurViewButton from "./BlurViewButton";
import RepostCard from "./RepostCard";
import { BlurView } from "expo-blur";
import RepostImageCard from "./RepostImageCard";

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = width - 32;
const CARD_WIDTH = width * 0.65;

const Post = ({ data, isFocused }) => {
  const [currentPost, setCurrentPost] = useState(data);
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
  const [showDropdown, setShowDropdown] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRepostModal, setShowRepostModal] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [repostData, setRepostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [use, setUse] = useState("Gallery");
  const [currentUser, setCurrentUser] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const scrollViewRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const postHeight = useRef(new Animated.Value(519)).current;
  const [isScrolled, setIsScrolled] = useState(false);
  const [showGridLayout, setShowGridLayout] = useState(false);

  // Enhanced overlay animation values - Updated for half screen
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const overlayTranslateY = useRef(new Animated.Value(height * 0.5)).current; // Start from half screen
  const postFadeOpacity = useRef(new Animated.Value(1)).current;
  const [showOverlay, setShowOverlay] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const getCurrentUser = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return null;
      const { data } = await axios.get(`${BASE_URL}/api/user/profile/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setCurrentUser(data);
      return data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const isOwnPost = data?.user?.user_id === currentUser?.id;

  const getReposts = async (postId = currentPost?.thread) => {
    if (postId) {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) return null;
        const response = await axios.get(
          `${BASE_URL}/api/feed/${postId}/get-reposts/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        if (response.data) {
          setRepostData(response.data.results);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching reposts", error);
        setLoading(false);
        return null;
      }
    }
  };

  useEffect(() => {
    getReposts();
  }, []);

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
    //navigation.navigate("PostDetails", { post: { ...data } });
  };

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
        console.log(data.id, response.data, data.total_likes);
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

  const handleCommentPress = () => {
    navigation.navigate("CommentModal", {
      postId: data?.id,
    });
  };

  const handleSharePress = () => {
    setShowShareModal(true);
  };

  const handleDeletePost = (id) => {
    console.log("Deleting post:", id);
  };

  const handleEditPost = (id) => {
    console.log("Editing post:", id);
  };

  const handleSharePost = (id) => {
    console.log("Sharing post:", id);
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
      }
    } catch (error) {
      console.error("Error generating report:", error);
    }
    console.log("Reporting post:", postId);
  };

  const handleBookMark = async (postId) => {
    const token = await AsyncStorage.getItem("authToken");
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
        showToast(`Post Bookmarked: ${response.data.post}`);
      }
      if (response.status === 200) {
        console.log("Post unBookmarked:", postId);
        showToast(`${response.data.message}: ${postId}`);
      }
    } catch (error) {
      console.error("Error generating bookmark:", error);
      showToast("Already bookmarked!");
    }
  };

  const handleRepostPress = async () => {
    setShowRepostModal(true);
  };

  // Enhanced scroll handler with half-screen overlay animation
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const scrollThreshold = height * 0.2;
        const halfScreenThreshold = height * 0.4;

        // When scrolling down past threshold
        if (offsetY > scrollThreshold && !isTransitioning && !showOverlay) {
          setIsTransitioning(true);
          setShowOverlay(true);

          Animated.parallel([
            Animated.timing(overlayOpacity, {
              toValue: 0.9,
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(overlayTranslateY, {
              toValue: 0,
              duration: 400,
              useNativeDriver: false,
            }),
          ]).start();
        }

        // When scrolling up (returning to top)
        if (offsetY < 50 && (isScrolled || showOverlay || showGridLayout)) {
          setIsScrolled(false);
          setIsTransitioning(false);
          setShowOverlay(false);
          setShowGridLayout(false); // Reset grid layout when returning to top

          Animated.parallel([
            Animated.timing(postHeight, {
              toValue: 519,
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(overlayOpacity, {
              toValue: 0,
              duration: 100,
              useNativeDriver: false,
            }),
            Animated.timing(overlayTranslateY, {
              toValue: height * 0.5,
              duration: 100,
              useNativeDriver: false,
            }),
            Animated.timing(postFadeOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: false,
            }),
          ]).start();
        }
      },
    }
  );

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });

    setIsScrolled(false);
    setShowOverlay(false);
    setIsTransitioning(false);
    setShowGridLayout(false); // Ensure grid layout is disabled when returning to top

    Animated.parallel([
      Animated.timing(postHeight, {
        toValue: 519,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(overlayTranslateY, {
        toValue: height * 0.5,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(postFadeOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleRepostSelect = (repost) => {
    setCurrentPost(repost);
    getReposts(repost.thread);
    scrollToTop();
  };

  const defaultUserImg = "https://randomuser.me/api/portraits/women/40.jpg";
  const firstThree = repostData?.slice(0, 3) || 0;
  const first = repostData[0];
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isFocused) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 10,
        useNativeDriver: true,
      }).start();
    }
  }, [isFocused, fadeAnim]);

  const animatedStyle = {
    opacity: fadeAnim,
  };

  useEffect(() => {
    let timer;
    if (showOverlay) {
      timer = setTimeout(() => {
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }).start(() => {
          setShowOverlay(false);
          setShowGridLayout(true);
          postHeight.setValue(140);
          // Navigate to GridLayout screen with repostData as parameter
          // navigation.navigate("GridLayout", {
          //   post: currentPost,
          //   reposts: repostData,
          //   onSelectRepost: handleRepostSelect,
          // });
        });
      }, 200); // Dismiss after 2 seconds
    }
    return () => clearTimeout(timer);
  }, [showOverlay]);

  const resetPostState = () => {
    setIsScrolled(false);
    setShowOverlay(false);
    setIsTransitioning(false);
    setShowGridLayout(false);
    setCurrentPost(data);
    scrollY.setValue(0);
    postHeight.setValue(519);
    overlayOpacity.setValue(0);
    overlayTranslateY.setValue(height * 0.5);
    postFadeOpacity.setValue(1);

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      resetPostState();
    });

    return unsubscribe;
  }, [navigation]);

  const gridFadeAnim = useRef(new Animated.Value(0)).current;
  const postFadeAnim = useRef(new Animated.Value(1)).current;

  // Add this useEffect for grid layout animations
  useEffect(() => {
    if (showGridLayout) {
      Animated.timing(postFadeAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.timing(gridFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(postFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.timing(gridFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showGridLayout]);

  return (
    <>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingBottom: 100,
          minHeight: height + 200, // Ensure content is taller than screen
        }}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {(isScrolled || showGridLayout) && (
          <View style={styles.threadConnector} />
        )}

        {/* Main Post */}
        <Animated.View
          style={[
            styles.carouselContainer,
            {
              height: showGridLayout ? 140 : postHeight, // Use 300px when grid layout is shown
              opacity: postFadeOpacity,
              marginTop: showGridLayout ? 100 : 0,
            },
          ]}
        >
          {/* Image Carousel - Only show if images exist and array is not empty */}
          {currentPost?.images &&
            Array.isArray(currentPost.images) &&
            currentPost.images.length > 0 && (
              <Pressable onPress={handlePostPress}>
                <GestureHandlerRootView
                  style={[
                    styles.carouselContainer,
                    isScrolled && styles.scrolledCarousel,
                  ]}
                >
                  <GHFlatList
                    ref={flatListRef}
                    data={currentPost?.images}
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
                                typeof item?.image === "string"
                                  ? item.image
                                  : null,
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
                    contentContainerStyle={{ borderRadius: 12 }}
                    style={{ borderRadius: 12 }}
                  />
                  {/* Pagination Dots */}
                  {currentPost?.images.length > 1 && (
                    <View style={styles.paginationDots}>
                      {data.images.map((_, index) => (
                        <View
                          key={`dot-${data.id}-${index}`}
                          style={[
                            styles.dot,
                            {
                              backgroundColor:
                                index === activeIndex ? "#87CEEB" : "#969292ff",
                              opacity: index === activeIndex ? 1 : 0.5,
                            },
                          ]}
                        />
                      ))}
                    </View>
                  )}
                  {/* Header */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      position: "absolute",
                      top: 10,
                      width: "100%",
                      paddingHorizontal: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("HostProfile", {
                          user: data?.user,
                        })
                      }
                      style={styles.header}
                    >
                      <Image
                        source={{
                          uri:
                            typeof data?.user?.image === "string"
                              ? data.user?.image
                              : DummyProfile,
                        }}
                        style={styles.avatar}
                        contentFit="cover"
                      />
                      <View style={styles.userInfo}>
                        <Text style={styles.name}>
                          {currentPost?.user?.display_name
                            ? currentPost?.user?.display_name
                            : `${currentPost?.user?.first_name} ${currentPost?.user?.last_name}`}
                        </Text>
                        <View style={styles.usernameTimeContainer}>
                          <Text style={styles.timeAgo}>
                            @{currentPost?.user?.username.split("@")[0]}
                          </Text>
                          <View style={styles.dotSeparator} />
                          <Text style={styles.timeAgo}>
                            {formatDate(currentPost?.date_created)}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {/* Image Counter */}
                      {currentPost?.images.length > 1 && (
                        <View style={styles.imageCounter}>
                          <Text style={styles.imageCounterText}>
                            {activeIndex + 1}/{currentPost?.images.length}
                          </Text>
                        </View>
                      )}
                      <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => setMenuVisible(true)}
                        activeOpacity={0.7}
                      >
                        <MaterialIcons
                          name="more-vert"
                          size={24}
                          color="#fff"
                          style={styles.textsShadows}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      bottom: showGridLayout ? null : 10,
                      top: showGridLayout ? 100 : null,
                      width: "100%",
                      paddingHorizontal: 10,
                      flexDirection: "row",
                      justifyContent: showGridLayout
                        ? "flex-start"
                        : "space-between",
                      alignItems: "flex-end",
                    }}
                  >
                    {/* content */}
                    {showGridLayout && (
                      <Pressable
                        style={[styles.statButton, { flexDirection: "row" }]}
                        onPress={handleLike}
                      >
                        {liked ? (
                          <FontAwesome name="heart" size={24} color="#1DA1F2" />
                        ) : (
                          <Feather
                            name="heart"
                            size={24}
                            color="#fff"
                            style={[styles.textsShadows]}
                          />
                        )}
                        <Text
                          style={[
                            styles.statText,
                            liked && styles.statTextLiked,
                          ]}
                        >
                          {likesCount >= 1000
                            ? (likesCount / 1000).toFixed(
                                likesCount % 1000 === 0 ? 0 : 1
                              ) + "K"
                            : likesCount}
                        </Text>
                      </Pressable>
                    )}
                    {!isScrolled && !showGridLayout && (
                      <>
                        <View style={{ width: 200 }}>
                          <Text style={styles.contentTitle}>
                            {currentPost?.title}
                          </Text>
                          <Pressable onPress={toggleDescription}>
                            <View>
                              <Text
                                style={styles.contentDescription}
                                numberOfLines={
                                  isDescriptionExpanded ? undefined : 2
                                }
                              >
                                {currentPost?.content}
                              </Text>
                              {!isDescriptionExpanded &&
                                currentPost?.content?.length > 80 && (
                                  <Text style={styles.readMore}>Read More</Text>
                                )}
                            </View>
                          </Pressable>
                        </View>
                        {/* Interaction Stats */}
                        <View style={styles.stats}>
                          <View style={styles.leftStats}>
                            <Pressable
                              style={styles.shareButton}
                              onPress={handleSharePress}
                            >
                              <Feather
                                name="send"
                                size={24}
                                color="#fff"
                                style={[styles.textsShadows]}
                              />
                            </Pressable>
                            <Pressable
                              style={styles.statButton}
                              onPress={handleLike}
                            >
                              {liked ? (
                                <FontAwesome
                                  name="heart"
                                  size={24}
                                  color="#1DA1F2"
                                />
                              ) : (
                                <Feather
                                  name="heart"
                                  size={24}
                                  color="#fff"
                                  style={[styles.textsShadows]}
                                />
                              )}
                              <Text
                                style={[
                                  styles.statText,
                                  liked && styles.statTextLiked,
                                ]}
                              >
                                {likesCount >= 1000
                                  ? (likesCount / 1000).toFixed(
                                      likesCount % 1000 === 0 ? 0 : 1
                                    ) + "K"
                                  : likesCount}
                              </Text>
                            </Pressable>
                            <Pressable
                              style={styles.statButton}
                              onPress={handleCommentPress}
                            >
                              <FontAwesome5
                                name="comment"
                                size={24}
                                color="#fff"
                                style={[styles.textsShadows]}
                              />
                              <Text style={styles.statText}>
                                {" "}
                                {currentPost?.total_comments >= 1000
                                  ? (
                                      currentPost?.total_comments / 1000
                                    ).toFixed(
                                      currentPost?.total_comments % 1000 === 0
                                        ? 0
                                        : 1
                                    ) + "K"
                                  : currentPost?.total_comments}
                              </Text>
                            </Pressable>
                            <Pressable
                              style={[styles.statButton, styles.repostBtn]}
                              onPress={handleRepostPress}
                            >
                              <RepostIcon />
                            </Pressable>
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                </GestureHandlerRootView>
              </Pressable>
            )}
        </Animated.View>

        {/* Main Post's Reposts Section */}
        <View style={styles.repostsContainer}>
          {/* repost header */}
          {!isScrolled && !showGridLayout && (
            <View style={styles.repostedContent}>
              <View style={styles.repostedAvatars}>
                {repostData?.slice(-5).map((avatar, index) => (
                  <Image
                    key={index}
                    source={{
                      uri:
                        typeof avatar.user?.image === "string"
                          ? avatar.user?.image
                          : DummyProfile,
                    }}
                    style={[
                      styles.repostedAvatar,
                      { marginLeft: index === 0 ? 0 : -8 },
                    ]}
                    contentFit="cover"
                  />
                ))}
              </View>
              <Text style={styles.repostedText}>
                {repostData?.length > 5 && `+${repostData?.length - 5}`}{" "}
                {repostData?.length > 5
                  ? "more reposted"
                  : `${repostData?.length} Reposts`}
              </Text>
            </View>
          )}
          <Animated.View style={[animatedStyle]}>
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#97D3FF"
                style={styles.loader}
              />
            ) : repostData?.length > 0 ? (
              <View
                style={{
                  marginTop: 30,
                }}
              >
                {!isScrolled && !showOverlay && !showGridLayout && (
                  <BlurViewButton scrollY={scrollY} />
                )}
                {!isScrolled &&
                  !showGridLayout &&
                  (repostData.length < 3 ? (
                    <>
                      {/* Left blurred card */}
                      <BlurView
                        intensity={30}
                        tint="dark"
                        style={[styles.card, styles.leftCard]}
                      >
                        <RepostImageCard item={first} />
                      </BlurView>
                      {/* Right blurred card */}
                      <BlurView
                        intensity={30}
                        tint="dark"
                        style={[styles.card, styles.rightCard]}
                      >
                        <RepostImageCard item={first} />
                      </BlurView>
                      {/* Centered clear card */}
                      <View style={[styles.card, styles.centerCard]}>
                        <RepostImageCard item={first} />
                      </View>
                    </>
                  ) : (
                    firstThree.map((item, index) => {
                      const isCenter = index === 0;
                      const cardStyle = [
                        styles.card,
                        index === 0 && styles.centerCard,
                        index === 1 && styles.leftCard,
                        index === 2 && styles.rightCard,
                      ];
                      const content = (
                        <View key={index} style={cardStyle}>
                          <RepostImageCard item={item} />
                        </View>
                      );
                      // Add blur for left/right cards
                      if (!isCenter) {
                        return (
                          <BlurView
                            intensity={60}
                            tint="light"
                            style={[
                              StyleSheet.absoluteFill,
                              styles.blurWrapper,
                            ]}
                            key={index}
                          >
                            {content}
                          </BlurView>
                        );
                      }
                      return content;
                    })
                  ))}
                {showGridLayout &&
                  !showOverlay &&
                  repostData.map((item, index) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.repostCardContainer,
                        index % 2 === 0
                          ? styles.repostRight
                          : styles.repostLeft,
                        { marginTop: index > 0 ? 20 : 0 },
                        {
                          // opacity: gridFadeAnim,
                          // transform: [
                          //   {
                          //     scale: gridFadeAnim.interpolate({
                          //       inputRange: [0, 1],
                          //       outputRange: [0.9, 1],
                          //     }),
                          //   },
                          // ],
                        },
                      ]}
                    >
                      <RepostCard
                        item={item}
                        key={index}
                        onSelect={handleRepostSelect}
                      />
                    </Animated.View>
                  ))}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <MaterialIcons
                  name="sentiment-neutral"
                  size={50}
                  color="#97D3FF"
                />
                <Text style={styles.emptyStateText}>No Reposts!</Text>
              </View>
            )}
          </Animated.View>
        </View>
      </Animated.ScrollView>

      {/* Half-Screen Overlay Animation */}
      {/*   {showOverlay && !showGridLayout && (
        <Animated.View
          style={[
            styles.halfScreenOverlay,
            {
              opacity: overlayOpacity,
              transform: [{ translateY: overlayTranslateY }],
            },
          ]}
        >
          <BlurView
            intensity={50}
            tint="dark"
            style={styles.blurContainer}
          ></BlurView>
        </Animated.View>
      )}*/}

      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        postContent={data.content}
        postId={data.id}
        navigation={navigation}
      />
      <RepostModal
        showRepostModal={showRepostModal}
        setShowRepostModal={setShowRepostModal}
        selectedPost={data}
        use={use}
        setUse={setUse}
        navigation={navigation}
      />
      <Post3dots
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        postId={data.id}
        postData={data}
        isOwnPost={isOwnPost}
        onDelete={handleDeletePost}
        onEdit={handleEditPost}
        onShare={handleSharePost}
        onReport={handleReportPost}
        showToast={showToast}
        handleBookMark={handleBookMark}
      />
      <Toast
        visible={toastVisible}
        message={toastMessage}
        onDismiss={() => setToastVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: height,
    position: "relative",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  blurContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  // Updated overlay to cover only half screen
  halfScreenOverlay: {
    position: "absolute",
    bottom: 0, // Start from bottom
    left: 0,
    right: 0,
    height: height * 0.5, // Only half screen height
    backgroundColor: "rgba(254, 250, 250, 0.93)",
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayContent: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
  },
  overlayText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
  },
  card: {
    position: "absolute",
    width: CARD_WIDTH,
    height: 250,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  centerCard: {
    zIndex: 3,
    left: 60,
    top: -20,
  },
  leftCard: {
    zIndex: 2,
    left: -CARD_WIDTH * 0.3,
    transform: [{ rotate: "-10deg" }],
    opacity: 0.3,
  },
  rightCard: {
    zIndex: 1,
    right: -CARD_WIDTH * 0.3,
    transform: [{ rotate: "10deg" }],
    opacity: 0.3,
  },
  blurWrapper: {
    borderRadius: 16,
  },
  threadConnector: {
    position: "absolute",
    left: width / 2.1,
    top: 110,
    bottom: 540,
    width: 1,
    backgroundColor: "#757575ff",
    zIndex: 0,
  },
  repostsContainer: {
    marginTop: 20,
    width: width,
    height: "100%",
    position: "relative",
  },
  carouselContainer: {
    marginTop: 5,
    overflow: "hidden",
    borderRadius: 12,
    marginHorizontal: 12,
    height: 519,
    width: ITEM_WIDTH - 8,
    zIndex: 10,
    position: "relative",
  },
  scrolledContainer: {
    paddingTop: 20,
  },
  scrolledCarousel: {
    height: 140,
    borderRadius: 12,
    // Additional styles for scrolled state if needed
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
    color: "#fff",
  },
  usernameTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  timeAgo: {
    fontSize: 14,
    color: "#fff",
  },
  dotSeparator: {
    width: 5,
    height: 5,
    borderRadius: 2,
    backgroundColor: "#D9D9D9",
    marginHorizontal: 6,
  },
  content: {
    // marginBottom: 8,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    lineHeight: 22,
  },
  contentDescription: {
    fontSize: 15,
    color: "#fff",

    lineHeight: 20,
    marginBottom: 4,
  },
  readMore: {
    fontSize: 15,
    color: "#fff",
    textShadowColor: "#14171A",
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    textShadowRadius: 7,
    lineHeight: 20,
  },
  imageWrapper: {
    width: ITEM_WIDTH - 20,
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
    width: ITEM_WIDTH - 20,
    height: "100%",
    borderRadius: 12,
  },
  imageCounter: {
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
    flexDirection: "column",
    marginTop: 12,
    paddingVertical: 4,
  },
  leftStats: {
    flexDirection: "column",
    gap: 20,
  },
  statButton: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: 4,
  },
  shareButton: {
    marginLeft: 15,
  },
  statText: {
    marginLeft: 6,
    color: "#fff",
    textShadowColor: "#14171A",
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    textShadowRadius: 7,
    fontSize: 14,
  },
  repostBtn: {
    backgroundColor: "#1DA1F2",
    padding: 12,
    borderRadius: 50,
  },
  statTextLiked: {
    color: "#1DA1F2",
  },
  textsShadows: {
    color: "#fff",
    textShadowColor: "#7c7c7cff",
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    textShadowRadius: 7,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.2)",
    alignSelf: "center",
    marginVertical: 12,
  },
  repostedBy: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 14,
  },
  repostedContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -5,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  repostedAvatars: {
    flexDirection: "row",
    alignItems: "center",
  },
  repostedAvatar: {
    width: 36,
    height: 36,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
    shadowColor: "#333",
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 4,
  },
  repostedText: {
    marginLeft: 8,
    color: "#000000",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "System",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: "Figtree-Bold",
    color: "#536471",
    marginTop: 12,
  },
  emptyStateSubText: {
    fontSize: 14,
    fontFamily: "Figtree-Regular",
    color: "#8E8E8E",
    marginTop: 8,
  },
  loader: {
    marginVertical: 10,
  },
  repostCardContainer: {
    width: "100%",
    alignSelf: "center",
  },
  repostLeft: {
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  repostRight: {
    alignSelf: "flex-end",
    marginRight: 30,
  },
});

export default React.memo(Post);
