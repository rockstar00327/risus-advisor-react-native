import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Pressable,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Video } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import LoveImg from "../../../assets/icons/love.svg";
import CommentImg from "../../../assets/icons/comment.svg";
import ShareImg from "../../../assets/icons/share.svg";
import BackButton from "../../../components/buttons/BackButton";
import CustomAlert from "../../../components/CustomAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../../../constant/BaseConst";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const PublishReels = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { video, title, desc, videoUri } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userName, setUserName] = useState("You");
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "",
    message: "",
  });
  const videoRef = React.useRef(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem("userName");
        const storedUserProfile = await AsyncStorage.getItem("userProfile");

        if (storedUserName) setUserName(storedUserName);
        if (storedUserProfile) setUserProfile(JSON.parse(storedUserProfile));
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  // console.log(videoUri);

  const CreateReel = async () => {
    if (!title.trim() || !desc.trim()) {
      setAlertConfig({
        visible: true,
        type: "error",
        message: "Please fill in all required fields",
      });
      return;
    }

    setIsPublishing(true); // Start loading

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (video) {
        const formData = new FormData();
        formData.append("content", desc);
        formData.append("video", video);

        const response = await axios.post(`${BASE_URL}/api/reels/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        });
        console.log(response);

        if (response.status === 201) {
          console.log("Successfully created reel:", response.data);
          setAlertConfig({
            visible: true,
            type: "success",
            message: "🎉 Reel created successfully!",
          });
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [
                { name: "MainTabs", state: { routes: [{ name: "Home" }] } },
              ],
            });
          }, 1500);
        }
      }
    } catch (error) {
      console.log(error);
      setAlertConfig({
        visible: true,
        type: "error",
        message: "Failed to create reel. Please try again.",
      });
    } finally {
      setIsPublishing(false); // Stop loading whether success or failure
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pauseAsync();
    } else {
      videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
    setShowControls(false);
  };

  const handleScreenPress = () => {
    setShowControls(true);
    setTimeout(() => setShowControls(false), 3000); // Hide controls after 3 seconds
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={handleScreenPress}
    >
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay={false}
        isLooping
      />

      {/* Heading */}
      <View style={styles.topContent}>
        <View style={styles.heading}>
          <BackButton navigation={navigation} />
          <Text style={styles.headTxt}>Reels Preview</Text>
          <TouchableOpacity
            onPress={CreateReel}
            style={[
              styles.nextbtn,
              styles.activeNextBtn,
              isPublishing && styles.disabledButton,
            ]}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={[styles.Txt, { marginLeft: 4 }]}>
                  Publishing...
                </Text>
              </View>
            ) : (
              <Text style={styles.Txt}>Publish</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Play Button */}
      {showControls && (
        <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
          <MaterialIcons
            name={isPlaying ? "pause" : "play-arrow"}
            size={40}
            color="white"
          />
        </TouchableOpacity>
      )}

      {/* Overlay Text and Actions */}
      <View style={styles.overlay}>
        {/* Profile Info */}
        <View style={styles.profileRow}>
          <Pressable
            // onPress={() => {
            //   navigation.navigate("HostProfile", {
            //     user: {
            //       user_id: item.user.id,
            //     },
            //   });
            // }}
            style={styles.profileInfo}
          >
            <Text style={styles.name}>{userProfile?.username}</Text>
            <Text style={styles.username}>@{userProfile?.username}</Text>
          </Pressable>

          {userProfile?.image ? (
            <Image source={{ uri: userProfile?.image }} style={styles.img} />
          ) : (
            <Image
              source={require("../../../assets/ProfileScreenImages/Profile.jpg")}
              style={styles.img}
            />
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.desc}>{desc}</Text>
        </View>

        {/* Actions */}
        <View style={[styles.row, { paddingBottom: 0 }]}>
          <TouchableOpacity
            // onPress={() => handleLike(item.id)}
            style={{
              marginRight: 25,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <LoveImg style={styles.icon} />

            <Text style={styles.status}>0</Text>
          </TouchableOpacity>
          <Pressable
            // onPress={() => {
            //   navigation.navigate("ReelCommentModal", {
            //     reelId: item.id,
            //   });
            // }}
            style={{
              marginRight: 25,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CommentImg style={styles.icon} />
            <Text style={styles.status}>0</Text>
          </Pressable>
          <Pressable
            // onPress={handleSharePress}
            style={{
              marginRight: 25,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ShareImg style={styles.icon} />
            <Text style={styles.status}>0</Text>
          </Pressable>
        </View>
      </View>
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
    </TouchableOpacity>
  );
};

export default PublishReels;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#acacad",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  heading: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  headTxt: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    marginLeft: 40,
  },
  Txt: {
    fontFamily: "Figtree-Medium",
    fontSize: 14,
  },
  nextbtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    minWidth: 100,
  },
  activeNextBtn: {
    backgroundColor: "#8ACEFF",
  },
  video: {
    width: width,
    height: height,
    position: "absolute",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -30 }, { translateY: -30 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    padding: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    position: "absolute",
    paddingTop: 15,
    paddingBottom: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    bottom: 0,
    left: 10,
    right: 10,
    paddingHorizontal: 15,
  },
  profileInfo: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
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
    top: 10,
    left: 5,
    right: 5,
    padding: 15,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
});
