import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = width / 2.2;
const ITEM_HEIGHT = COLUMN_WIDTH * 1.5;

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
      //console.log("Error getting duration for video:", videoUri, error);
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
  // console.log(reels);

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
          title: "My Amazing Reel",
          desc: reel.content || "A beautiful moment captured in time ✨",
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

  //  dummy reels
  const dummyReels = [
    {
      id: "1",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      user: {
        display_name: "John Doe",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      content: "Amazing sunset timelapse",
      total_likes: 1200,
      total_comments: 45,
      total_shares: 67,
    },
    {
      id: "2",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      user: {
        display_name: "Jane Smith",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      content: "Studio photography tips",
      total_likes: 890,
      total_comments: 32,
      total_shares: 41,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.gridContainer}>
        {reels.map((reel, index) => (
          <TouchableOpacity
            key={index}
            style={styles.reelItem}
            onPress={() => handleReelPress(reel.id)}
          >
            <Video
              source={{ uri: reel.video }}
              style={styles.video}
              resizeMode="cover"
              shouldPlay={false}
              isLooping
            />
            <View style={styles.overlay}>
              <View style={styles.topInfo}>
                <View style={styles.durationBadge}>
                  <Ionicons name="time-outline" size={10} color="#fff" />
                  <Text style={styles.duration}>
                    {" "}
                    {durations[reel.id] || "0:30"}
                  </Text>
                </View>
                <View style={styles.viewCount}>
                  <Ionicons name="eye" size={10} color="#fff" />
                  <Text style={styles.viewText}>{reel.total_shares}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  gridContainer: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  reelItem: {
    width: COLUMN_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 10,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
