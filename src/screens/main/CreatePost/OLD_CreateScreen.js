import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  StatusBar,
  Platform,
  SafeAreaView,
  Switch,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import CustomAlert from "../../../components/CustomAlert";
import axios from "axios";
import { BASE_URL } from "../../../constant/BaseConst";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isHighlightEnabled, setIsHighlightEnabled] = useState(false);
  const [isCommentsEnabled, setIsCommentsEnabled] = useState(true);
  const [isDraft, setIsDraft] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const [showFormatting, setShowFormatting] = useState(false);
  const [expandedTools, setExpandedTools] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "",
    message: "",
  });
  const [selectedFormat, setSelectedFormat] = useState("post");
  const [titleFormat, setTitleFormat] = useState({
    bold: false,
    italic: false,
  });
  const [contentFormat, setContentFormat] = useState({
    bold: false,
    italic: false,
  });
  const [selectedField, setSelectedField] = useState(null);

  // Animation value for the expanding tools
  const [toolsAnimation] = useState(new Animated.Value(0));

  const [isPosting, setIsPosting] = useState(false);

  const toggleTools = () => {
    setExpandedTools(!expandedTools);
    Animated.spring(toolsAnimation, {
      toValue: expandedTools ? 0 : 1,
      useNativeDriver: true,
    }).start();
  };

  const handleBack = () => navigation.navigate("Home");

  const handlePost = async () => {
    if (!title.trim() || !description.trim()) {
      setAlertConfig({
        visible: true,
        type: "error",
        message: "Please fill in all required fields",
      });
      return;
    }

    setIsPosting(true);

    try {
      const token = await AsyncStorage.getItem("authToken");

      // Step 1: Create the post without images
      const postResponse = await axios.post(
        `${BASE_URL}/api/posts/`,
        {
          title,
          content: description,
          isRepost: "false",
          isDraft: String(isDraft),
          isHighlight: String(isHighlightEnabled),
          enableComment: String(isCommentsEnabled),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      // console.log(postResponse.data);

      const postId = postResponse.data.id;
      console.log("Post created successfully. Post ID:", postId);

      // Step 2: Upload images if any
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
        // Wait for all image uploads to complete
        await Promise.all(imageUploadPromises);
        console.log("All images uploaded successfully");
      }

      // Show success message
      setAlertConfig({
        visible: true,
        type: "success",
        message: "🎉 Post created successfully!",
      });

      // Smooth transition to home
      setTimeout(() => {
        setTitle("");
        setDescription("");
        setSelectedImages([]);
        navigation.navigate("Home");
      }, 1500);
    } catch (error) {
      console.log(error);
      setAlertConfig({
        visible: true,
        type: "error",
        message: "Failed to create post. Please try again.",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim() && !description.trim() && selectedImages.length === 0) {
      setIsDraft((prev) => !prev);
      setAlertConfig({
        visible: true,
        type: "warning",
        message: "Nothing to save in draft",
      });
      return;
    }

    try {
      // Simulate saving draft
      await new Promise((resolve) => setTimeout(resolve, 800));

      setAlertConfig({
        visible: true,
        type: "success",
        message: "📝 Draft saved successfully!",
      });

      setTimeout(() => {
        navigation.navigate("Home");
      }, 1500);
    } catch (error) {
      setAlertConfig({
        visible: true,
        type: "error",
        message: "Failed to save draft. Please try again.",
      });
    }
  };

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      setAlertConfig({
        visible: true,
        type: "error",
        message: "Sorry, we need camera roll permissions to make this work!",
      });
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
        aspect: [4, 3],
      });
      if (!result.canceled) {
        // Handle both single and multiple image selections
        const newImages = result.assets.map((asset) => {
          // Extract the file name from the URI
          const fileName = asset.uri.split("/").pop();

          // Create a file-like object
          const file = {
            uri: asset.uri,
            name: fileName,
            type: asset.mimeType || "image/jpeg", // Default to 'image/jpeg' if mimeType is not available
          };

          return file;
        });
        setSelectedImages((prev) => [...prev, ...newImages]);
      }
    } catch (error) {
      setAlertConfig({
        visible: true,
        type: "error",
        message: "Failed to pick image",
      });
    }
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Animated styles for the expanding tools
  const expandedToolsStyle = {
    transform: [
      {
        translateY: toolsAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -120],
        }),
      },
    ],
  };

  // Add smooth animations for tool buttons
  const handleToolPress = (toolType) => {
    Animated.sequence([
      Animated.timing(toolsAnimation, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(toolsAnimation, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Handle tool specific actions
    switch (toolType) {
      case "format":
        setShowFormatting(!showFormatting);
        break;
      case "link":
        // Handle link
        break;
      case "image":
        pickImage();
        break;
    }
  };

  const getTextStyle = (format) => {
    const style = {};
    if (format.bold) style.fontWeight = "bold";
    if (format.italic) style.fontStyle = "italic";
    return style;
  };

  const toggleFormat = (type) => {
    if (selectedField === "title") {
      setTitleFormat((prev) => ({
        ...prev,
        [type]: !prev[type],
      }));
    } else if (selectedField === "content") {
      setContentFormat((prev) => ({
        ...prev,
        [type]: !prev[type],
      }));
    }
  };

  const ModernSwitch = ({ value, onValueChange }) => {
    return (
      <TouchableOpacity
        style={[styles.modernSwitch, value && styles.modernSwitchActive]}
        onPress={() => onValueChange(!value)}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.modernSwitchThumb,
            value && styles.modernSwitchThumbActive,
          ]}
        />
      </TouchableOpacity>
    );
  };
  // console.log(selectedImages);

  const handlePreview = () => {
    // Prepare the data to pass to the preview screen
    const previewData = {
      title,
      content: description,
      images: selectedImages,
      userName: "@username", // API
      fullName: "User Name", // API
      profileImage: "https://via.placeholder.com/100", // API
    };

    // Navigate to the preview screen with the post data
    navigation.navigate("PostPreview", { postData: previewData });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.container}>
        {/*header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}> Make a contribution</Text>
          <TouchableOpacity
            style={[
              styles.postButton,
              title.length > 0 &&
                description.length > 0 &&
                styles.activePostButton,
              isPosting && styles.disabledButton,
            ]}
            onPress={handlePost}
            disabled={isPosting || !title.length || !description.length}
          >
            {isPosting ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text
                  style={[
                    styles.postButtonText,
                    styles.activePostButtonText,
                    { marginLeft: 4 },
                  ]}
                >
                  Posting...
                </Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.postButtonText,
                  title.length > 0 &&
                    description.length > 0 &&
                    styles.activePostButtonText,
                ]}
              >
                Post
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Format Selector */}
        <View style={styles.formatSelector}>
          <TouchableOpacity
            style={[
              styles.formatButton,
              selectedFormat === "post" && styles.activeFormatButton,
            ]}
            onPress={() => {
              setSelectedFormat("post");
            }}
          >
            <Ionicons
              name="document-text-outline"
              size={20}
              color={selectedFormat === "post" ? "#3498DB" : "#7F8C8D"}
            />
            <Text
              style={[
                styles.formatText,
                selectedFormat === "post" && styles.activeFormatText,
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.formatButton,
              selectedFormat === "reels" && styles.activeFormatButton,
            ]}
            onPress={() => {
              setSelectedFormat("reels");
              navigation.navigate("createreel");
            }}
          >
            <Ionicons
              name="videocam-outline"
              size={20}
              color={selectedFormat === "reels" ? "#3498DB" : "#7F8C8D"}
            />
            <Text
              style={[
                styles.formatText,
                selectedFormat === "reels" && styles.activeFormatText,
              ]}
            >
              Reels
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          {/* Tools matching the image design */}
          <View>
            <View style={styles.toolsContainer}>
              <TouchableOpacity
                style={[
                  styles.toolButton,
                  { backgroundColor: showFormatting ? "#E3F2FD" : "#FFFFFF" },
                ]}
                onPress={() => handleToolPress("format")}
              >
                <Text style={styles.toolText}>Tt</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity 
              style={[styles.toolButton, { backgroundColor: '#FFFFFF' }]}
              onPress={() => handleToolPress('link')}
            >
              <Ionicons name="link-outline" size={24} color="#2C3E50" />
            </TouchableOpacity> */}
              <TouchableOpacity
                style={[styles.toolButton, { backgroundColor: "#FFFFFF" }]}
                onPress={() => handleToolPress("image")}
              >
                <Ionicons name="image-outline" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            {/* Text formatting options directly below tools */}
            {showFormatting && (
              <View style={styles.textFormatting}>
                <TouchableOpacity
                  style={[
                    styles.formatTool,
                    (selectedField === "title"
                      ? titleFormat.bold
                      : contentFormat.bold) && styles.activeFormatTool,
                  ]}
                  onPress={() => toggleFormat("bold")}
                >
                  <Text style={styles.formatToolText}>B</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.formatTool,
                    (selectedField === "title"
                      ? titleFormat.italic
                      : contentFormat.italic) && styles.activeFormatTool,
                  ]}
                  onPress={() => toggleFormat("italic")}
                >
                  <Text style={styles.formatToolText}>I</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Content Area */}
          <View style={styles.contentContainer}>
            <TextInput
              style={[styles.titleInput, getTextStyle(titleFormat)]}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              onFocus={() => setSelectedField("title")}
            />
            <View style={styles.titleUnderline} />

            <TextInput
              style={[styles.contentInput, getTextStyle(contentFormat)]}
              placeholder="Write Description"
              value={description}
              onChangeText={setDescription}
              multiline
              onFocus={() => setSelectedField("content")}
            />
            {/* Image Grid */}
            {selectedImages.length > 0 && (
              <View style={styles.imageGrid}>
                {selectedImages.map((image, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image
                      source={{ uri: image.uri }}
                      style={styles.thumbnailImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons name="close-circle" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.draftButton}
              onPress={handleSaveDraft}
            >
              <Text style={styles.draftButtonText}>Save Draft</Text>
              <Ionicons name="newspaper-outline" size={20} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.previewButton}
              onPress={handlePreview}
            >
              <Text style={styles.previewButtonText}>See Post Preview</Text>
            </TouchableOpacity>
          </View>

          {/* Highlight and Comment Options Panel */}
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <View style={styles.leftOptions}>
                <TouchableOpacity style={styles.optionButton}>
                  <Ionicons name="star" size={24} color="#7F8C8D" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    isCommentsEnabled && styles.activeOptionButton,
                  ]}
                  onPress={() => setIsCommentsEnabled(!isCommentsEnabled)}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={24}
                    color="#7F8C8D"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[
                  styles.expandButton,
                  expandedTools && styles.activeExpandButton,
                ]}
                onPress={toggleTools}
              >
                <Ionicons
                  name={expandedTools ? "chevron-down" : "chevron-up"}
                  size={24}
                  color="#7F8C8D"
                />
              </TouchableOpacity>
            </View>

            <Animated.View
              style={[
                styles.expandedOptions,
                {
                  maxHeight: expandedTools ? 300 : 0,
                  opacity: toolsAnimation,
                },
              ]}
            >
              <View style={styles.optionItem}>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionTitle}>Highlights</Text>
                  <Text style={styles.optionDescription}>
                    Enabling Highlights Will Allow Users To Enter Highlights
                  </Text>
                </View>
                <ModernSwitch
                  value={isHighlightEnabled}
                  onValueChange={setIsHighlightEnabled}
                />
              </View>

              <View style={styles.optionItem}>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionTitle}>Comment</Text>
                  <Text style={styles.optionDescription}>
                    Enabling Comment Will Allow Users To Comment
                  </Text>
                </View>
                <ModernSwitch
                  value={isCommentsEnabled}
                  onValueChange={setIsCommentsEnabled}
                />
              </View>
            </Animated.View>
          </View>

          {/* Bottom Spacing for Tab Bar */}
          <View style={styles.bottomTabSpace} />
        </ScrollView>
      </View>

      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#fbfeffcc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Figtree-Bold",
    color: "#2C3E50",
    textAlign: "center",
  },
  postButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activePostButton: {
    backgroundColor: "#97D3FF",
  },
  postButtonText: {
    fontSize: 16,
    fontFamily: "Figtree-Bold",
    color: "#97D3FF",
  },
  activePostButtonText: {
    color: "#FFFFFF",
  },
  toolsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  toolButton: {
    width: 44,
    height: 44,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ECF0F1",
    shadowColor: "#CEEAFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 100,
    elevation: 2,
  },
  toolText: {
    fontSize: 20,
    fontFamily: "Figtree-Bold",
    color: "#2C3E50",
  },
  contentContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    //maxHeight: "45%",
    margin: 10,
    shadowColor: "#CEEAFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 100,
    elevation: 5,
  },
  titleInput: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
    fontFamily: "Figtree-Regular",
    height: 40,
  },
  titleUnderline: {
    height: 1,
    backgroundColor: "#333",
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 16,
    color: "#666",
    paddingVertical: 8,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 8,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 4,
    // marginBottom: 20,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  thumbnailImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  optionsContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#CEEAFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 100,
    elevation: 5,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  leftOptions: {
    flexDirection: "row",
    gap: 20,
  },
  optionButton: {
    padding: 8,
    borderRadius: 20,
  },
  activeOptionButton: {
    backgroundColor: "#F7F9FA",
  },
  expandButton: {
    padding: 8,
    borderRadius: 20,
  },
  activeExpandButton: {
    backgroundColor: "#F7F9FA",
  },
  expandedOptions: {
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  optionInfo: {
    flex: 1,
    paddingRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: "#7F8C8D",
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginTop: 20,
  },
  draftButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
    shadowColor: "#CEEAFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 100,
    elevation: 5,
  },
  draftButtonText: {
    color: "#000",
    fontSize: 13,
    fontFamily: "Figtree-Bold",
  },
  previewButton: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#CEEAFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 100,
    elevation: 5,
  },
  previewButtonText: {
    color: "#333",
    fontSize: 13,
    fontFamily: "Figtree-Bold",
  },
  formatSelector: {
    flexDirection: "row",
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  formatButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#F7F9FA",
  },
  activeFormatButton: {
    backgroundColor: "#E3F2FD",
  },
  formatText: {
    fontSize: 14,
    fontFamily: "Figtree-Bold",
    color: "#7F8C8D",
    marginLeft: 6,
  },
  activeFormatText: {
    color: "#3498DB",
  },
  textFormatting: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    justifyContent: "flex-start",
    backgroundColor: "#fbfeffcc",
  },
  formatTool: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F7F9FA",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ECF0F1",
    marginHorizontal: 5,
  },
  activeFormatTool: {
    backgroundColor: "#E3F2FD",
    borderColor: "#3498DB",
  },
  formatToolText: {
    fontSize: 16,
    fontFamily: "Figtree-Regular",
    color: "#7F8C8D",
  },
  bottomTabSpace: {
    height: Platform.OS === "ios" ? 84 : 64,
  },
  modernSwitch: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#E0E0E0",
    padding: 2,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  modernSwitchActive: {
    backgroundColor: "#CEEAFF",
  },
  modernSwitchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginLeft: 0,
  },
  modernSwitchThumbActive: {
    transform: [{ translateX: 20 }],
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default CreateScreen;
