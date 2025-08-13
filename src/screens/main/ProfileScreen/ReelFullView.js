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
  Platform,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Video } from "expo-av";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import BackButton from "../../../components/buttons/BackButton";
// Import the same components used in ReelsScreen
import LoveImg from "../../../assets/icons/love.svg";
import CommentImg from "../../../assets/icons/comment.svg";
import ShareImg from "../../../assets/icons/share.svg";
import CustomAlert from "../../../components/CustomAlert";
import ReelShareModal from "../reels/ReelShareModal";

const { width, height } = Dimensions.get("screen");

const ReelFullView = ({ route, navigation }) => {
  const { selectedReelId, reelsData } = route.params;
  const [currentIndex, setCurrentIndex] = useState(reelsData.findIndex(reel => reel.id === selectedReelId));
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRefs = useRef([]);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [currentReel, setCurrentReel] = useState(null);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "",
    message: "",
  });

  // Handle video playback when component mounts
  useEffect(() => {
    if (videoRefs.current[currentIndex]) {
      videoRefs.current[currentIndex].playAsync();
    }
    return () => {
      videoRefs.current.forEach(videoRef => {
        if (videoRef) {
          videoRef.pauseAsync().catch(() => {});
          videoRef.unloadAsync().catch(() => {});
        }
      });
    };
  }, []);

  const handleViewableItemsChanged = ({ viewableItems }) => {
    if (!viewableItems || viewableItems.length === 0) return;
    const index = viewableItems[0].index;
    setCurrentIndex(index);
    setIsPlaying(true);

    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === index) {
        video.playAsync().catch(err => console.log(`Error playing video ${idx}:`, err));
      } else {
        video.pauseAsync().catch(err => console.log(`Error pausing video ${idx}:`, err));
      }
    });
  };

  const handlePlayPause = () => {
    if (videoRefs.current[currentIndex]) {
      if (isPlaying) {
        videoRefs.current[currentIndex].pauseAsync();
      } else {
        videoRefs.current[currentIndex].playAsync();
      }
      setIsPlaying(!isPlaying);
      setShowControls(true);
      setTimeout(() => setShowControls(false), 2000);
    }
  };

  const toggleOverlay = () => {
    Animated.timing(fadeAnim, {
      toValue: overlayVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setOverlayVisible(!overlayVisible));
  };

  // Add handleLike function
  const handleLike = async (id) => {
    // Implement like functionality if needed
    console.log("Like pressed for reel:", id);
  };

  // Simplify handleSharePress function
  const handleSharePress = () => {
    setShareModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <FlatList
        data={reelsData}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        decelerationRate="fast"
        initialScrollIndex={currentIndex}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
        renderItem={({ item, index }) => (
          <View style={styles.reelContainer}>
            <TouchableOpacity
              style={styles.fullScreenTouchable}
              activeOpacity={1}
              onPress={() => {
                handlePlayPause();
                toggleOverlay();
              }}
            >
              <Video
                ref={ref => (videoRefs.current[index] = ref)}
                source={{ uri: item.videoUri }}
                style={styles.video}
                resizeMode="cover"
                shouldPlay={index === currentIndex}
                isLooping
                useNativeControls={false}
              />

              {/* Play/Pause Indicator */}
              {showControls && (
                <View style={styles.playButton}>
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={50}
                    color="white"
                  />
                </View>
              )}

              {/* Top Header */}
              <View style={styles.topContent}>
                <View style={styles.heading}>
                  <BackButton navigation={navigation} />
                  <Text style={styles.headTxt}>Quickies</Text>
                  <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={22} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Overlay Content */}
              {overlayVisible && (
                <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                  <View style={styles.profileRow}>
                    <Pressable
                      style={styles.profileInfo}
                      onPress={() => {
                        if (item.user && item.user.id) {
                          navigation.navigate("HostProfile", {
                            user: {
                              user_id: item.user.id,
                            },
                          });
                        }
                      }}
                    >
                      <Image source={item.userImage} style={styles.profileImage} />
                      <View style={styles.userInfo}>
                        <Text style={styles.username}>{item.user}</Text>
                        <Text style={styles.caption}>{item.desc}</Text>
                      </View>
                    </Pressable>
                  </View>

                  {/* Actions */}
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleLike(item.id)}
                    >
                      {item.is_liked ? (
                        <AntDesign name="heart" size={28} color="#fff" />
                      ) : (
                        <LoveImg style={styles.icon} />
                      )}
                      <Text style={styles.actionText}>{item.likes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        navigation.navigate("ReelCommentModal", {
                          reelId: item.id,
                        });
                      }}
                    >
                      <CommentImg style={styles.icon} />
                      <Text style={styles.actionText}>{item.comments}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={handleSharePress}
                    >
                      <ShareImg style={styles.icon} />
                      <Text style={styles.actionText}>{item.shares}</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              )}
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Add Modals */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
      <ReelShareModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        reelData={{
          caption: "Check out this reel!",
          shareUrl: "https://yourapp.com/reels/share",
          thumbnail: null
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  reelContainer: {
    width: width,
    height: height,
    backgroundColor: '#000',
  },
  fullScreenTouchable: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  playButton: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 15,
  },
  topContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 10 : StatusBar.currentHeight + 0,
    paddingHorizontal: 15,
    paddingBottom: 15,
    //backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headTxt: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Figtree-Medium',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 34,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Figtree-Medium',
  },
  caption: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Figtree-Regular',
    marginTop: 4,
  },
  icon: {
    width: 28,
    height: 28,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 20,
    marginTop: 20,
  },
  actionButton: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Figtree-Regular',
    marginTop: 4,
  },
});

export default ReelFullView;
