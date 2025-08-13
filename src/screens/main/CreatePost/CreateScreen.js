import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Animated from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../../constant/BaseConst";

// Import icons
import EmojiIcon from "../../../components/buttons/PostCreation/Emoji";
import HashTagIcon from "../../../components/buttons/PostCreation/HashTag";
import BoldIcon from "../../../components/buttons/PostCreation/Bold_Icon";
import ItalicIcon from "../../../components/buttons/PostCreation/Italic_icon";
import GalleryIcon from "../../../components/buttons/PostCreation/Gallery";
import WorldIcon from "../../../components/buttons/PostCreation/World";
import CommentIcon from "../../../components/buttons/PostCreation/Comment";
import LocationIcon from "../../../components/buttons/PostCreation/Location";
import WhoCanSee from "./WhoCanSee";
import UseEmoji from "./UseEmoji";
import CustomAlert from "../../../components/CustomAlert";

const CreateScreen = () => {
  const navigation = useNavigation();
  const [postTitle, setPostTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allowComments, setAllowComments] = useState(true);
  const [whoCanSee, setWhoCanSee] = useState("everyone");
  const [showWhoCanSee, setShowWhoCanSee] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "success",
    message: "",
  });

  const handlePost = async () => {
    if (!postTitle.trim() || !description.trim()) {
      setAlertConfig({
        visible: true,
        type: "error",
        message: "Please fill in both title and description",
      });
      return;
    }

    try {
      setIsPosting(true);
      const token = await AsyncStorage.getItem("authToken");
      const postResponse = await axios.post(
        `${BASE_URL}/api/posts/`,
        {
          title: postTitle,
          content: description,
          isRepost: "false",
          isDraft: "false",
          isHighlight: "false",
          enableComment: String(allowComments),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      const postId = postResponse.data.id;
      let finalPostData = postResponse.data;

      if (selectedImages.length > 0) {
        const imageUploadPromises = selectedImages.map((image) => {
          const formData = new FormData();
          formData.append("post", postId);
          formData.append("image", {
            uri: image.uri,
            name: image.name || "image.jpg",
            type: image.type || "image/jpeg",
          });

          return axios.post(`${BASE_URL}/api/posts/add-image/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Token ${token}`,
            },
          });
        });

        await Promise.all(imageUploadPromises);
        
        // Get the updated post data with images
        const updatedPostResponse = await axios.get(
          `${BASE_URL}/api/posts/${postId}/`,
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        finalPostData = updatedPostResponse.data;
      }

      setAlertConfig({
        visible: true,
        type: "success",
        message: "🎉 Post created successfully!",
      });

      setTimeout(() => {
        setPostTitle("");
        setDescription("");
        setSelectedImages([]);
        navigation.navigate("Home", { 
          fromPostCreate: true,
          newPost: finalPostData  // Pass the complete post data
        });
      }, 1500);
    } catch (error) {
      console.error("Post creation error:", error);
      setAlertConfig({
        visible: true,
        type: "error",
        message: "Failed to create post. Please try again.",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleEmojiSelect = (emoji) => {
    if (activeInput === "title") {
      setPostTitle((prevTitle) => prevTitle + emoji);
    } else if (activeInput === "description") {
      setDescription((prevDesc) => prevDesc + emoji);
    }
    setShowEmoji(false);
  };

  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      const newImages = result.assets.map((image) => ({
        uri: image.uri,
        type: "image/jpeg",
        name: image.uri.split("/").pop(),
      }));
      setSelectedImages((prev) => [...prev, ...newImages].slice(0, 10));
    }
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const SelectedImagesPreview = () => {
    if (selectedImages.length === 0) return null;

    return (
      <View style={styles.selectedImagesContainer}>
        <Text style={styles.sectionTitle}>Selected Images</Text>
        <View style={styles.imageGridContainer}>
          {selectedImages.map((image, index) => (
            <View key={index} style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: image.uri }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <Feather name="x" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Custom Alert */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        message={alertConfig.message}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />

      {/* Header - Fixed */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity
          style={styles.reelsButton}
          onPress={() => navigation.navigate("createreel")}
        >
          <MaterialIcons name="video-collection" size={24} color="#0066CC" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={true}
          overScrollMode="never"
          scrollEventThrottle={16}
        >
          <View style={styles.formContainer}>
            {/* Title Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Post Title</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="Write the title of your post"
                value={postTitle}
                onChangeText={setPostTitle}
                onFocus={() => setActiveInput("title")}
                placeholderTextColor="#999"
              />
              <View style={styles.separator} />
            </View>

            {/* Description Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <TextInput
                style={styles.descriptionInput}
                placeholder="What's on your mind?"
                value={description}
                onChangeText={setDescription}
                onFocus={() => setActiveInput("description")}
                multiline
                placeholderTextColor="#999"
              />
            </View>

            <SelectedImagesPreview />

            {/* Formatting Tools */}
            <View style={styles.toolsContainer}>
              <TouchableOpacity
                style={styles.toolButton}
                onPress={() => {
                  if (activeInput) {
                    setShowEmoji(true);
                  }
                }}
              >
                <EmojiIcon />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolButton}>
                <HashTagIcon />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolButton}>
                <BoldIcon />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolButton}>
                <ItalicIcon />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.toolButton}
                onPress={handleImagePicker}
              >
                <GalleryIcon />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />

            {/* Post Settings */}
            <View style={styles.settingsContainer}>
              <View style={styles.settingRow}>
                <TouchableOpacity
                  style={[styles.settingLeft, { flex: 1 }]}
                  onPress={() => setShowWhoCanSee(true)}
                >
                  <WorldIcon />
                  <Text style={styles.settingText}>Who can See this?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.settingRight}
                  onPress={() => setShowWhoCanSee(true)}
                >
                  <Text style={styles.settingValue}>
                    {whoCanSee === "everyone"
                      ? "Everyone"
                      : whoCanSee === "followers"
                        ? "Followers"
                        : "Only me"}
                  </Text>
                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <CommentIcon />
                  <Text style={styles.settingText}>Allow Comments</Text>
                </View>
                <TouchableOpacity
                  style={styles.toggleContainer}
                  onPress={() => setAllowComments(!allowComments)}
                >
                  <View
                    style={[
                      styles.toggle,
                      allowComments && styles.toggleActive,
                    ]}
                  >
                    <Animated.View
                      style={[
                        styles.toggleKnob,
                        allowComments && styles.toggleKnobActive,
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {/* In the NEXT update */}
              {/* <TouchableOpacity style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <LocationIcon />
                  <Text style={styles.settingText}>Add Location</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity> */}
            </View>
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Post Button - Fixed */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.postButton, isPosting && styles.postButtonPosting]}
          onPress={handlePost}
          disabled={isPosting}
        >
          {isPosting ? (
            <View style={styles.postingContainer}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.postButtonText}>Posting...</Text>
            </View>
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <WhoCanSee
        visible={showWhoCanSee}
        onClose={() => setShowWhoCanSee(false)}
        onSelect={setWhoCanSee}
        currentValue={whoCanSee}
      />

      <UseEmoji
        visible={showEmoji}
        onClose={() => setShowEmoji(false)}
        onEmojiSelect={handleEmojiSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 150,
  },
  formContainer: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    zIndex: 1,
  },
  bottomContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 40 : 20,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingBottom: Platform.OS === "ios" ? 16 : 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    zIndex: 1,
  },
  closeButton: {
    fontSize: 24,
    color: "#000",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Figtree-Bold",
  },
  previewButton: {
    color: "#0066CC",
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Figtree-Medium",
    color: "#000",
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 14,
    fontFamily: "Figtree-Regular",
    color: "#000",
    padding: 0,
    marginBottom: 4,
    height: 40,
  },
  descriptionInput: {
    fontSize: 14,
    fontFamily: "Figtree-Regular",
    color: "#000",
    padding: 0,
    height: 120,
    textAlignVertical: "top",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginTop: 4,
  },
  toolsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 12,
  },
  toolButton: {
    padding: 4,
  },
  settingsContainer: {
    marginTop: 20,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Figtree-Regular",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Figtree-Regular",
  },
  chevron: {
    fontSize: 20,
    color: "#666",
  },
  toggle: {
    width: 51,
    height: 31,
    backgroundColor: "#E5E5E5",
    borderRadius: 15.5,
    justifyContent: "center",
    position: "relative",
  },
  toggleActive: {
    backgroundColor: "#0066CC",
  },
  toggleKnob: {
    width: 27,
    height: 27,
    backgroundColor: "#fff",
    borderRadius: 13.5,
    position: "absolute",
    left: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toggleKnobActive: {
    transform: [{ translateX: 20 }],
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    fontFamily: "Figtree-Regular",
    textAlign: "center",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  postButton: {
    backgroundColor: "#0066CC",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  postButtonPosting: {
    opacity: 0.7,
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Figtree-SemiBold",
  },
  postingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  toggleContainer: {
    padding: 2,
  },
  selectedImagesContainer: {
    marginBottom: 24,
  },
  imageGridContainer: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  imagePreviewContainer: {
    width: "48%",
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: 150,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#FF3B30",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  reelsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6F3FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
});

export default CreateScreen;
