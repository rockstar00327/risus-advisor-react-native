import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Video } from "expo-av";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = width / 2.2;
const ITEM_HEIGHT = COLUMN_WIDTH * 1.5;
const GAP = 10;

const Reels = ({ reels }) => {
  const navigation = useNavigation();
  const [durations, setDurations] = useState({});

  // Function to get duration for a single video
  const getDuration = async (videoUri, reelId) => {
    try {
      // Create a temporary video reference
      const videoRef = new Video.Sound();

      // Load the video (without playing it)
      await videoRef.loadAsync({ uri: videoUri }, {}, false);

      // Get the status which contains duration
      const status = await videoRef.getStatusAsync();

      if (status.isLoaded && status.durationMillis) {
        const minutes = Math.floor(status.durationMillis / 60000);
        const seconds = Math.floor((status.durationMillis % 60000) / 1000);
        const formattedDuration = `${minutes}:${
          seconds < 10 ? "0" : ""
        }${seconds}`;

        setDurations((prev) => ({
          ...prev,
          [reelId]: formattedDuration,
        }));
      }

      // Unload the video to free resources
      await videoRef.unloadAsync();
    } catch (error) {
      console.log("Error getting duration for video:", videoUri, error);
      setDurations((prev) => ({
        ...prev,
        [reelId]: "0:00", // Default fallback
      }));
    }
  };

  // Fetch durations when component mounts or reels change
  useEffect(() => {
    if (reels) {
      reels.forEach((reel) => {
        if (reel.video) {
          getDuration(reel.video, reel.id);
        }
      });
    }
  }, [reels]);

  const handleReelPress = (reelId) => {
    const clickedReel = reels.find((reel) => reel.id === reelId);
    const reelsWithVideos = reels.filter((reel) => reel.video);

    if (clickedReel && clickedReel.video) {
      navigation.navigate("ReelFullView", {
        selectedReelId: reelId,
        reelsData: reelsWithVideos.map((reel) => ({
          id: reel.id,
          videoUri: reel.video,
          user: reel.user.display_name,
          userImage:
            { uri: reel.user.image } ||
            require("../../../assets/ProfileScreenImages/Profile.jpg"),
          title: " ",
          desc: reel.content || " ",
          likes: reel.total_likes,
          comments: reel.total_comments,
          shares: reel.total_shares,
        })),
      });
    }
  };

  // Create chunks of 2 items instead of 3
  const chunks = reels?.reduce((acc, item, index) => {
    const chunkIndex = Math.floor(index / 2);
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [];
    }
    acc[chunkIndex].push(item);
    return acc;
  }, []);

  return (
    <ScrollView
      style={styles.container}
      removeClippedSubviews={true}
      showsVerticalScrollIndicator={false}
    >
      {/* FlatList may cause issues with nested scrolling in this layout. */}
      <View style={styles.gridContainer}>
        {chunks?.map((chunk, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {chunk.map((item) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.reelItem}
                  onPress={() => handleReelPress(item.id)}
                  activeOpacity={0.95}
                >
                  <Image
                    source={{
                      uri:
                        item.video ||
                        "https://images.unsplash.com/photo-1600096194534-95cf5ece04cf",
                    }}
                    style={styles.thumbnail}
                    contentFit="cover"
                    transition={200}
                  />
                  <View style={styles.overlay}>
                    <View style={styles.topInfo}>
                      <View style={styles.durationBadge}>
                        <Ionicons name="time-outline" size={10} color="#fff" />
                        <Text style={styles.duration}>
                          {" "}
                          {durations[item.id] || "0:00"}
                        </Text>
                      </View>
                      <View style={styles.viewCount}>
                        <Ionicons name="play" size={10} color="#fff" />
                        <Text style={styles.viewText}>{item.total_shares}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  gridContainer: {
    padding: GAP,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: GAP,
  },
  reelItem: {
    width: COLUMN_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 8,
  },
  topInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 3,
  },
  viewCount: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 3,
  },
  viewText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Figtree-Medium",
  },
  duration: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Figtree-Medium",
  },
});

export default Reels;
