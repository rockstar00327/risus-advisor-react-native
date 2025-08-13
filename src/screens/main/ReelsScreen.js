import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Image,
  FlatList,
  Animated,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Video } from "expo-av";
import {
  AntDesign,
  MaterialIcons,
  Ionicons,
  Feather,
} from "@expo/vector-icons";
import LoveImg from "../../assets/icons/love.svg";
import CommentImg from "../../assets/icons/comment.svg";
import ShareImg from "../../assets/icons/share.svg";
import BackButton from "../../components/buttons/BackButton.js";
import MenuImg from "../../assets/icons/menu.svg";
import { useFocusEffect } from "@react-navigation/native";
import { BASE_URL } from "../../constant/BaseConst.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import CustomAlert from "../../components/CustomAlert.js";
import axios from "axios";
import { Platform } from "react-native";
import ReelShareModal from "./reels/ReelShareModal";

const { width, height } = Dimensions.get("screen");
const ReelsScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRefs = useRef([]);
  const [reels, setReels] = useState([]);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "",
    message: "",
  });
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [currentReel, setCurrentReel] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const overlayTimeoutRef = useRef(null);
  const [showHint, setShowHint] = useState(true);
  const hintFadeAnim = useRef(new Animated.Value(1)).current;
  const [preloadedVideos, setPreloadedVideos] = useState({});
  const [videoLoading, setVideoLoading] = useState(false);

  const fetchReels = async () => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await fetch(`${BASE_URL}/api/reels/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setReels(result.results);
        setLoading(false);
      }
      // console.log(result.results);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();

    if (videoRefs.current[0]) {
      videoRefs.current[0].playAsync();
    }
  }, []);

  // useEffect(() => {
  //   // Preload next videos when reels data is loaded
  //   const preloadVideos = async () => {
  //     const preloadMap = {};
  //     for (let i = 0; i < Math.min(reels.length, 3); i++) {
  //       // Preload next 3 videos
  //       const video = new Video.Video();
  //       await video.loadAsync({ uri: reels[i].video || reels[i].videoUri });
  //       preloadMap[reels[i].id] = video;
  //     }
  //     setPreloadedVideos(preloadMap);
  //   };

  //   if (reels.length > 0) {
  //     preloadVideos();
  //   }

  //   return () => {
  //     // Cleanup preloaded videos
  //     Object.values(preloadedVideos).forEach((video) => video.unloadAsync());
  //   };
  // }, [reels]);

  useEffect(() => {
    return () => {
      // Clean up all video references on unmount
      if (videoRefs.current) {
        videoRefs.current.forEach((videoRef) => {
          if (videoRef) {
            try {
              videoRef.pauseAsync().catch(() => {});
              videoRef.unloadAsync().catch(() => {});
            } catch (e) {
              console.log("Error cleaning up video:", e);
            }
          }
        });
      }
    };
  }, []);

  // Auto-play first video when screen loads

  // Stop video when navigating away from screen
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        videoRefs.current.forEach((video) => {
          if (video) video.pauseAsync();
        });
      };
    }, [])
  );

  // Function to handle auto-play of the currently visible video
  const handleViewableItemsChanged = ({ viewableItems }) => {
    if (!viewableItems || viewableItems.length === 0) return;

    try {
      const index = viewableItems[0].index;
      setCurrentIndex(index);
      setIsPlaying(true);

      // Safety check on videoRefs
      if (!videoRefs.current) return;

      videoRefs.current.forEach((video, idx) => {
        if (!video) return; // Skip if video ref is not available

        try {
          if (idx === index) {
            video
              .playAsync()
              .catch((err) => console.log(`Error playing video ${idx}:`, err));
          } else {
            video
              .pauseAsync()
              .catch((err) => console.log(`Error pausing video ${idx}:`, err));
          }
        } catch (e) {
          console.log(`Error handling video ${idx}:`, e);
        }
      });
    } catch (error) {
      console.log("Error in viewable items change handler:", error);
    }
  };

  // Toggle Play/Pause
  const handlePlayPause = () => {
    if (videoRefs.current[currentIndex]) {
      if (isPlaying) {
        videoRefs.current[currentIndex].pauseAsync();
      } else {
        videoRefs.current[currentIndex].playAsync();
      }
      setIsPlaying(!isPlaying);
      setShowControls(true);
      setTimeout(() => setShowControls(false), 3000); // Hide controls after 3 seconds
    }
  };

  //const defaultUserImage = "https://randomuser.me/api/portraits/men/2.jpg";

  const reelsData = [
    {
      id: "1",
      videoUri:
        //"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "https://advisor-django-46d4aa46efd5.herokuapp.com/media/reels/upload/Screencast_from_2025-02-04_21-19-58.webm",
      user: "Apon",
      userImage: "https://randomuser.me/api/portraits/men/2.jpg",
      title: "The Vast Wonder of Space 🌌✨",
      desc: "A realm of infinite possibilities, endless mysteries, and unparalleled beauty.",
      likes: "16.9k",
      comments: "2.3k",
      shares: "200",
    },
    {
      id: "2",
      videoUri:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      user: "Emily",
      userImage: "https://randomuser.me/api/portraits/women/3.jpg",
      title: "Dreams of Elephants 🐘✨",
      desc: "A surreal journey through an imaginative world.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
      likes: "22.1k",
      comments: "1.2k",
      shares: "500",
    },
    {
      id: "3",
      videoUri:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      user: "Michael",
      userImage: "https://randomuser.me/api/portraits/men/4.jpg",
      title: "Sintel's Adventure 🔥🐉",
      desc: "A journey to find a lost dragon.",
      likes: "30.4k",
      comments: "5.2k",
      shares: "1.5k",
    },
  ];

  const handleLike = async (id) => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      // Find the index of the reel
      const reelIndex = reels.findIndex((reel) => reel.id === id);
      if (reelIndex === -1) return;

      // Optimistically update the UI
      const updatedReels = [...reels];
      updatedReels[reelIndex] = {
        ...updatedReels[reelIndex],
        is_liked: !updatedReels[reelIndex].is_liked,
        total_likes: updatedReels[reelIndex].is_liked
          ? updatedReels[reelIndex].total_likes - 1
          : updatedReels[reelIndex].total_likes + 1,
      };
      setReels(updatedReels);

      // Send request to API
      const url = `${BASE_URL}/api/reels/${id}/like-unlike/`;
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status !== 201) {
        // Revert UI if API fails
        updatedReels[reelIndex] = {
          ...updatedReels[reelIndex],
          is_liked: !updatedReels[reelIndex].is_liked, // Revert like status
          total_likes: updatedReels[reelIndex].is_liked
            ? updatedReels[reelIndex].total_likes - 1
            : updatedReels[reelIndex].total_likes + 1, // Revert like count
        };
        setReels(updatedReels);
        console.log("Failed to react to reel");
      }
    } catch (err) {
      console.log("Error:", err);

      // Revert UI on error
      const reelIndex = reels.findIndex((reel) => reel.id === id);
      if (reelIndex !== -1) {
        const updatedReels = [...reels];
        updatedReels[reelIndex] = {
          ...updatedReels[reelIndex],
          is_liked: !updatedReels[reelIndex].is_liked, // Revert like status
          total_likes: updatedReels[reelIndex].is_liked
            ? updatedReels[reelIndex].total_likes - 1
            : updatedReels[reelIndex].total_likes + 1, // Revert like count
        };
        setReels(updatedReels);
      }
    }
  };

  const handleSharePress = (reelData) => {
    setCurrentReel(reelData);
    setShareModalVisible(true);
  };

  //console.log(reels);

  // Function to toggle overlay visibility
  const toggleOverlay = () => {
    if (overlayVisible) {
      // Hide overlay
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setOverlayVisible(false);
      });
    } else {
      // Show overlay
      setOverlayVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-hide after 4 seconds
      startOverlayTimer();
    }
  };

  // Function to start the auto-hide timer
  const startOverlayTimer = () => {
    // Clear any existing timeout
    if (overlayTimeoutRef.current) {
      clearTimeout(overlayTimeoutRef.current);
    }

    // Set new timeout
    overlayTimeoutRef.current = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setOverlayVisible(false);
      });
    }, 4000);
  };

  // Reset timer when user interacts with controls
  const resetOverlayTimer = () => {
    if (overlayVisible) {
      startOverlayTimer();
    }
  };

  // Start timer when component mounts and when current index changes
  useEffect(() => {
    if (overlayVisible) {
      startOverlayTimer();
    }

    return () => {
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
      }
    };
  }, [currentIndex, overlayVisible]);

  // Add this effect to auto-hide the hint after a few seconds
  useEffect(() => {
    // Show hint for 5 seconds when a new reel is loaded
    if (showHint) {
      const timer = setTimeout(() => {
        Animated.timing(hintFadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(() => {
          setShowHint(false);
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, showHint]);

  // Reset hint when changing videos
  useEffect(() => {
    setShowHint(true);
    hintFadeAnim.setValue(1);
  }, [currentIndex]);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : reels.length > 0 ? (
        <FlatList
          data={reels}
          keyExtractor={(item) => item.id.toString()}
          pagingEnabled
          maxToRenderPerBatch={3}
          windowSize={3}
          initialNumToRender={1}
          snapToAlignment="start"
          snapToInterval={height}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{
            viewAreaCoveragePercentThreshold: 80,
            minimumViewTime: 300,
          }}
          renderItem={({ item, index }) => (
            <View style={styles.reelContainer}>
              <TouchableOpacity
                style={styles.fullScreenTouchable}
                activeOpacity={1}
                onPress={() => {
                  // Single tap toggles play/pause
                  handlePlayPause();
                }}
              >
                <Video
                  ref={(ref) => (videoRefs.current[index] = ref)}
                  source={{ uri: item.video || item.videoUri }}
                  style={styles.video}
                  resizeMode="cover"
                  shouldPlay={index === currentIndex}
                  isLooping
                  onLoadStart={() => setVideoLoading(true)}
                  onReadyForDisplay={() => setVideoLoading(false)}
                />
                {videoLoading && (
                  <ActivityIndicator
                    style={styles.videoLoadingIndicator}
                    size="large"
                    color="#fff"
                  />
                )}

                {/* Play/Pause Indicator - briefly visible when state changes */}
                {showControls && (
                  <View style={styles.playButton}>
                    <MaterialIcons
                      name={isPlaying ? "pause" : "play-arrow"}
                      size={50}
                      color="white"
                    />
                  </View>
                )}

                {/* Top Header - always visible */}
                <View style={styles.topContent}>
                  <View style={styles.heading}>
                    <BackButton navigation={navigation} />
                    <Text style={styles.headTxt}>Quickies</Text>
                    <TouchableOpacity>
                      <Ionicons
                        name="ellipsis-vertical"
                        size={22}
                        style={{ color: "white" }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Bottom Info Button - Always visible when overlay is hidden */}
                {!overlayVisible && !videoLoading && (
                  <TouchableOpacity
                    style={styles.bottomInfoButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleOverlay();
                    }}
                  >
                    <Feather name="chevron-up" size={24} color="white" />
                    <Text style={styles.infoButtonText}>Tap to engage</Text>
                  </TouchableOpacity>
                )}

                {/* Animated Overlay */}
                {overlayVisible && !videoLoading && (
                  <Animated.View
                    style={[styles.overlay, { opacity: fadeAnim }]}
                  >
                    {/* Pull down indicator at top of overlay */}
                    <TouchableOpacity
                      style={styles.pullDownIndicator}
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleOverlay();
                      }}
                    >
                      <Feather name="chevron-down" size={30} color="white" />
                    </TouchableOpacity>

                    {/* Profile Info */}
                    <View style={styles.profileRow}>
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          resetOverlayTimer();
                          if (item.user && item.user.id) {
                            navigation.navigate("HostProfile", {
                              user: {
                                user_id: item.user.id,
                              },
                            });
                          }
                        }}
                        style={styles.profileInfo}
                      >
                        <Text style={styles.name}>
                          {item.user?.username || item.user}
                        </Text>
                        <Text style={styles.username}>
                          @{item.user?.username || item.user}
                        </Text>
                      </Pressable>

                      {item.user?.image ? (
                        <Image
                          source={{ uri: item.user.image }}
                          style={styles.img}
                        />
                      ) : item.userImage ? (
                        <Image
                          source={{ uri: item.userImage }}
                          style={styles.img}
                        />
                      ) : (
                        <Image
                          source={require("../../assets/ProfileScreenImages/Profile.jpg")}
                          style={styles.img}
                        />
                      )}
                    </View>

                    <View style={styles.content}>
                      <Text style={styles.title}>
                        {item.title || "No Title"}
                      </Text>
                      <Text style={styles.desc}>
                        {item.content || item.desc}
                      </Text>
                    </View>

                    {/* Actions */}
                    <View style={[styles.row, { paddingBottom: 0 }]}>
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          resetOverlayTimer();
                          if (item.id) handleLike(item.id);
                        }}
                        style={{ marginRight: 25 }}
                      >
                        {item.is_liked ? (
                          <AntDesign name="heart" size={28} color="#fff" />
                        ) : (
                          <LoveImg style={styles.icon} />
                        )}

                        <Text style={styles.status}>
                          {item.total_likes >= 1000
                            ? (item.total_likes / 1000).toFixed(
                                item.total_likes % 1000 === 0 ? 0 : 1
                              ) + "K"
                            : item.total_likes}
                        </Text>
                      </TouchableOpacity>

                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          resetOverlayTimer();
                          navigation.navigate("ReelCommentModal", {
                            reelId: item.id,
                          });
                        }}
                        style={{ marginRight: 25 }}
                      >
                        <CommentImg style={styles.icon} />
                        <Text style={styles.status}>
                          {item.total_comments >= 1000
                            ? (item.total_comments / 1000).toFixed(
                                item.total_comments % 1000 === 0 ? 0 : 1
                              ) + "K"
                            : item.total_comments}
                        </Text>
                      </Pressable>

                      <TouchableOpacity
                        style={{ marginRight: 25 }}
                        onPress={(e) => {
                          e.stopPropagation();
                          resetOverlayTimer();
                          handleSharePress({
                            caption:
                              item.content ||
                              item.desc ||
                              "Check out this awesome reel!",
                            shareUrl:
                              "https://yourapp.com/reels/" + (item.id || "123"),
                            thumbnail: item.thumbnail || item.userImage,
                          });
                        }}
                      >
                        <ShareImg style={styles.icon} />
                        <Text style={styles.status}>
                          {item.total_shares >= 1000
                            ? (item.total_shares / 1000).toFixed(
                                item.total_shares % 1000 === 0 ? 0 : 1
                              ) + "K"
                            : item.total_shares}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                )}
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <MaterialIcons
            name="sentiment-dissatisfied"
            size={70}
            color="white"
          />
          <Text style={styles.noDataText}>No Quickies Available</Text>
        </View>
      )}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
      <ReelShareModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        reelData={currentReel}
      />
    </SafeAreaView>
  );
};

export default ReelsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  reelContainer: {
    marginTop: Platform.OS === "ios" ? 10 : 0,
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenTouchable: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
  },
  playButton: {
    position: "absolute",
    top: "45%",
    left: "45%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    padding: 15,
  },
  overlay: {
    position: "absolute",

    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 15,
    paddingBottom: 90,
    paddingHorizontal: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  profileInfo: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  videoLoadingIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  title: {
    width: "51%",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  name: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 10,
    fontFamily: "Figtree-Medium",
  },
  username: {
    color: "#fff",
    fontSize: 13,
    marginTop: 5,
    fontFamily: "Figtree-Regular",
  },
  desc: {
    width: "51%",
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
    textAlign: "left",
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 15,
  },
  row: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: -120,
    gap: 10,
    marginBottom: 15,
    //bottom: 70,
    //paddingBottom: 40,
  },
  img: {
    width: 43,
    height: 43,
    borderRadius: 10,
  },
  content: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  status: {
    color: "#fff",
    fontSize: 12,
  },
  icon: {
    width: 28,
    height: 28,
  },
  topContent: {
    position: "absolute",
    top: 5,
    left: 10,
    right: 10,
    padding: 15,
  },
  heading: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headTxt: {
    fontFamily: "Figtree-Medium",
    fontSize: 19,
    color: "#fff",
  },
  loader: {
    marginVertical: 20,
  },
  infoButton: {
    position: "absolute",
    top: 90,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  hintContainer: {
    position: "absolute",
    top: 90,
    right: 70,
    zIndex: 10,
  },

  hintBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    maxWidth: 200,
  },

  hintText: {
    color: "white",
    fontSize: 12,
    marginLeft: 5,
    fontFamily: "Figtree-Regular",
  },

  bottomInfoButton: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 0,
    zIndex: 10,
  },

  infoButtonText: {
    color: "white",
    fontSize: 14,
    marginLeft: 8,
    fontFamily: "Figtree-Medium",
  },

  pullDownIndicator: {
    width: "100%",
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  pullDownBar: {
    width: 40,
    height: 5,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 3,
  },
  engageButton: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 10,
  },

  engageButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
    fontFamily: "Figtree-Medium",
  },

  detailsPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 10,
    paddingBottom: 80,
  },

  closeButton: {
    alignSelf: "center",
    marginBottom: 10,
    padding: 5,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    marginTop: 20,
    color: "white",
    fontSize: 18,
    fontFamily: "Figtree-Medium",
  },
});
