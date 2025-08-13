import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
  Platform,
  Dimensions,
  StatusBar,
} from "react-native";
import BackButton from "../../../components/buttons/BackButton";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { Audio } from "expo-av";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import CustomAlert from "../../../components/CustomAlert";

// Get screen dimensions
const { width } = Dimensions.get("window");

const CreateReel = ({ navigation }) => {
  const [videoUri, setVideoUri] = useState(null);
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Adjustments");

  // Sample audio waveform data
  const audioWaveform = Array.from(
    { length: 50 },
    () => Math.random() * 0.8 + 0.2
  );

  useEffect(() => {
    (async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
    })();
  }, []);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "",
    message: "",
  });

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setAlertConfig({
        visible: true,
        type: "error",
        message: "Permission to access media library is required!",
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedVideo = result.assets[0];
      setVideoUri(selectedVideo.uri);

      // Extract file format from URI
      const fileType = selectedVideo.uri.split(".").pop();

      // Create a video object for FormData
      const videoFile = {
        uri: selectedVideo.uri,
        name: `video.${fileType}`,
        type: `video/${fileType}`,
      };

      setVideo(videoFile);

      // Auto-play the video after selection
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.playAsync();
        }
      }, 500);
    }
  };

  const handlePlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
      setIsPlaying(status.isPlaying);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pauseAsync();
      } else {
        videoRef.current.playAsync();
      }
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.setPositionAsync(Math.max(0, (currentTime - 5) * 1000));
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.setPositionAsync(
        Math.min(duration * 1000, (currentTime + 5) * 1000)
      );
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create your reel</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Video Preview */}
      <View style={styles.videoContainer}>
        {videoUri ? (
          <>
            <Video
              ref={videoRef}
              source={{ uri: videoUri }}
              style={styles.video}
              resizeMode="cover"
              onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
              isLooping
              useNativeControls={false}
            />
            {/* Change video button */}
            <TouchableOpacity
              style={styles.changeVideoButton}
              onPress={pickVideo}
            >
              <FontAwesome5 name="exchange-alt" size={16} color="white" />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.uploadContainer}>
            <TouchableOpacity
              style={styles.uploadVideoButton}
              onPress={pickVideo}
            >
              <Ionicons name="videocam" size={40} color="white" />
              <Text style={styles.uploadButtonText}>Select Video</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Video Controls */}
      {videoUri && (
        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={skipBackward}>
            <Ionicons name="play-skip-back" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={togglePlayPause}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={24}
              color="black"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={skipForward}>
            <Ionicons name="play-skip-forward" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.timeText}>
            {formatTime(currentTime)}/{formatTime(duration)}
          </Text>
        </View>
      )}

      {/* Media Thumbnails */}
      {videoUri && (
        <View style={styles.thumbnailsContainer}>
          <View style={styles.thumbnailItem}>
            <Image source={{ uri: videoUri }} style={styles.thumbnail} />
            <Text style={styles.thumbnailText}>Thumbnail</Text>
          </View>

          <TouchableOpacity style={styles.addMediaButton} onPress={pickVideo}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Audio Waveform */}
      {videoUri && (
        <View style={styles.audioContainer}>
          <Text style={styles.audioText}>Audio.mp3</Text>
          <View style={styles.waveformContainer}>
            {audioWaveform.map((height, index) => (
              <View
                key={index}
                style={[styles.waveformBar, { height: height * 40 }]}
              />
            ))}
          </View>
        </View>
      )}

      {/* Editing Tools */}
      {/* {videoUri && (
        <View style={styles.toolsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity 
              style={[styles.toolButton, selectedTab === 'Adjustments' && styles.selectedToolButton]} 
              onPress={() => setSelectedTab('Adjustments')}
            >
              <Ionicons name="options-outline" size={24} color="black" />
              <Text style={styles.toolText}>Adjustments</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.toolButton, selectedTab === 'Filters' && styles.selectedToolButton]} 
              onPress={() => setSelectedTab('Filters')}
            >
              <Ionicons name="color-filter-outline" size={24} color="black" />
              <Text style={styles.toolText}>Filters</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.toolButton, selectedTab === 'Text' && styles.selectedToolButton]} 
              onPress={() => setSelectedTab('Text')}
            >
              <Ionicons name="text-outline" size={24} color="black" />
              <Text style={styles.toolText}>Text</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.toolButton, selectedTab === 'Stickers' && styles.selectedToolButton]} 
              onPress={() => setSelectedTab('Stickers')}
            >
              <Ionicons name="happy-outline" size={24} color="black" />
              <Text style={styles.toolText}>Stickers</Text>
            </TouchableOpacity> 
            
            <TouchableOpacity 
              style={[styles.toolButton, selectedTab === 'Audio' && styles.selectedToolButton]} 
              onPress={() => setSelectedTab('Audio')}
            >
              <Ionicons name="musical-notes-outline" size={24} color="black" />
              <Text style={styles.toolText}>Audio</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )} */}

      {/* Caption and description field */}
      {videoUri && (
        <View style={styles.inputContainer}>
          <View style={styles.captionContainer}>
            <Ionicons
              name="text-outline"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.captionInput}
              placeholder="Add a caption..."
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
              multiline
              maxLength={150}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.descriptionContainer}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.descriptionInput}
              placeholder="Add a description..."
              placeholderTextColor="#999"
              value={desc}
              onChangeText={setDesc}
              multiline
              maxLength={300}
            />
          </View>

          <View style={styles.charCounter}>
            <Text style={styles.charCounterText}>
              {title.length}/150 • {desc.length}/300
            </Text>
          </View>
        </View>
      )}

      {/* Next Button */}
      <TouchableOpacity
        style={[styles.nextButton, !videoUri && styles.disabledButton]}
        onPress={() => {
          if (videoUri) {
            navigation.navigate("publishreel", {
              video: video,
              title: title || "My Awesome Reel",
              desc: desc || "Check out my new reel!",
              videoUri: videoUri,
            });
          } else {
            pickVideo();
          }
        }}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>

      {/* Custom Alert */}
      {alertConfig.visible && (
        <CustomAlert
          visible={alertConfig.visible}
          type={alertConfig.type}
          message={alertConfig.message}
          onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Figtree-Medium",
    color: "black",
  },
  settingsButton: {
    padding: 8,
  },
  videoContainer: {
    width: "100%",
    height: width * 1.2, // Maintain aspect ratio
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  uploadContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
  },
  uploadVideoButton: {
    backgroundColor: "#0063AC",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButtonText: {
    color: "white",
    marginTop: 10,
    fontFamily: "Figtree-Medium",
    fontSize: 16,
  },
  changeVideoButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  timeText: {
    fontFamily: "Figtree-Regular",
    fontSize: 14,
    color: "#666",
  },
  thumbnailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  thumbnailItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnail: {
    width: 60,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
  },
  thumbnailText: {
    fontFamily: "Figtree-Regular",
    fontSize: 12,
    color: "#666",
  },
  addMediaButton: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: "#0063AC",
    justifyContent: "center",
    alignItems: "center",
  },
  audioContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  audioText: {
    fontFamily: "Figtree-Regular",
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  waveformContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 40,
    justifyContent: "space-between",
  },
  waveformBar: {
    width: 3,
    backgroundColor: "#666",
    marginHorizontal: 1,
    borderRadius: 1,
  },
  toolsContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  toolButton: {
    alignItems: "center",
    marginHorizontal: 15,
  },
  selectedToolButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#0063AC",
  },
  toolText: {
    fontFamily: "Figtree-Regular",
    fontSize: 12,
    marginTop: 5,
  },
  nextButton: {
    backgroundColor: "#0063AC",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 90,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#8ACEFF",
  },
  nextButtonText: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    color: "white",
  },
  inputContainer: {
    marginHorizontal: 16,
    marginVertical: 15,
    backgroundColor: "#f8f8f8",
    borderColor: "#999",
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 0,
    // elevation: 2,
  },
  captionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  inputIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  captionInput: {
    flex: 1,
    fontFamily: "Figtree-Medium",
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
  },
  descriptionInput: {
    flex: 1,
    fontFamily: "Figtree-Regular",
    fontSize: 14,
    color: "#333",
    paddingVertical: 0,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 12,
  },
  charCounter: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  charCounterText: {
    fontFamily: "Figtree-Regular",
    fontSize: 12,
    color: "#999",
  },
});

export default CreateReel;
