import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../../constant/BaseConst";
import axios from "axios";
import CustomAlert from "../../../components/CustomAlert";

const { width } = Dimensions.get("window");

const UseAIFinalStep = ({ navigation, route }) => {
  const [caption, setCaption] = useState("");
  const selectedImages = route.params?.selectedImages || [];
  const title = route.params?.title || [];
  const postId = route.params?.postId || [];

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "",
    message: "",
  });

  const [isPosting, setIsPosting] = useState(false);

  // console.log(title, selectedImages, postId, caption);

  useEffect(() => {
    //  console.log("Selected Images in Final Step:", selectedImages);
  }, [selectedImages]);

  const handlePost = async () => {
    setIsPosting(true);

    const token = await AsyncStorage.getItem("authToken");
    const formattedImages = selectedImages.map((image) => {
      if (typeof image === "string" && image.startsWith("https")) {
        return image; // Keep the URL as is
      } else {
        return {
          uri: image.uri || image,
          name: image.name || "image.jpg",
          type: image.type || "image/jpeg",
        };
      }
    });
    //console.log(formattedImages);
    if (
      typeof selectedImages[0] === "string" &&
      selectedImages[0].startsWith("https")
    ) {
      try {
        const response = await axios.post(
          `${BASE_URL}/api/posts/${postId}/repost/ai-create/`,
          {
            title: title,
            content: caption,
            images: formattedImages,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );

        // console.log(response);

        if (response.status === 201) {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "MainTabs",
                state: {
                  routes: [{ name: "Home" }],
                },
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error generating repost:", error);
        setAlertConfig({
          visible: true,
          type: "error",
          message: "Failed to create repost. Please try again.",
        });
      } finally {
        setIsPosting(false);
      }
    } else {
      try {
        const token = await AsyncStorage.getItem("authToken");

        // Step 1: Create the post without images
        const postResponse = await axios.post(
          `${BASE_URL}/api/posts/`,
          {
            title: title,
            content: caption,
            isRepost: "true",
            isDraft: String(false),
            isHighlight: String(false),
            enableComment: String(true),
            main_post: postId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );

        // console.log(postResponse.data);

        const repostId = postResponse.data.id;
        console.log("Repost created successfully. Repost ID:", repostId);

        // Step 2: Upload images if any
        if (formattedImages.length > 0 && repostId) {
          const imageUploadPromises = formattedImages.map((image) => {
            const formData = new FormData();
            formData.append("post", repostId);
            formData.append("image", {
              uri: image.uri,
              name: image.name || "image.jpg",
              type: image.type || "image/jpeg",
            });
            // console.log(formData);

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
          message: "🎉 Repost created successfully!",
        });

        // Smooth transition to home
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "MainTabs",
                state: {
                  routes: [{ name: "Home" }],
                },
              },
            ],
          });
        }, 1500);
      } catch (error) {
        console.log(error);
        setAlertConfig({
          visible: true,
          type: "error",
          message: "Failed to create repost. Please try again.",
        });
      } finally {
        setIsPosting(false);
      }
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const newImage = result.assets[0].uri;
        navigation.navigate("UseAIFinalStep", {
          selectedImages: [...selectedImages, newImage],
        });
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reposting @username's Post</Text>
      </View>

      {/* Progress Steps */}
      <View style={styles.progressContainer}>
        <View style={styles.stepRow}>
          <View style={[styles.step, styles.completedStep]}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
          <View style={styles.stepLine} />
          <View style={[styles.step, styles.completedStep]}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
          <View style={styles.stepLine} />
          <View style={[styles.step, styles.activeStep]}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
        </View>
        <View style={styles.stepLabelRow}>
          <Text style={styles.stepLabel}>Generate and{"\n"}Choose Image</Text>
          <Text style={[styles.stepLabel, { marginLeft: -15 }]}>
            Edit and{"\n"}Caption
          </Text>
          <Text style={styles.stepLabel_active}>Review and{"\n"}Post</Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Write a Caption</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Write down what you feel about the post"
            multiline
            value={caption}
            onChangeText={setCaption}
            maxLength={250}
          />
          <Text style={styles.charCount}>{caption.length}/250</Text>
        </View>

        <Text style={styles.imagesTitle}>Images</Text>
        <View style={styles.imageGrid}>
          {Array.isArray(selectedImages) &&
            selectedImages.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                {image.uri ? (
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.selectedImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={{ uri: image }}
                    style={styles.selectedImage}
                    resizeMode="cover"
                  />
                )}
              </View>
            ))}
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleImagePick}
          >
            <Ionicons name="image-outline" size={24} color="#666" />
            <Text style={styles.uploadText}>Upload from Gallery</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Post Button */}
      <TouchableOpacity
        style={[styles.postButton, isPosting && styles.disabledButton]}
        onPress={handlePost}
        disabled={isPosting}
      >
        {isPosting ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#FFFFFF" size="small" />
            <Text style={[styles.postButtonText, { marginLeft: 8 }]}>
              Posting...
            </Text>
          </View>
        ) : (
          <Text style={styles.postButtonText}>Post</Text>
        )}
      </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Figtree-Medium",
    marginLeft: 16,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    marginHorizontal: "auto",
  },
  step: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
  },
  activeStep: {
    backgroundColor: "#0066CC",
  },
  completedStep: {
    backgroundColor: "#0066CC",
  },
  stepNumber: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Figtree-Medium",
  },
  stepLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#0066CC",
    marginHorizontal: 8,
  },
  stepLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 8,
  },
  stepLabel: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
    fontFamily: "Figtree-Regular",
  },
  stepLabel_active: {
    fontSize: 12,
    textAlign: "center",
    color: "#0066CC",
    fontFamily: "Figtree-Regular",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: "Figtree-Medium",
    marginBottom: 12,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  input: {
    height: 100,
    textAlignVertical: "top",
    fontSize: 14,
    fontFamily: "Figtree-Regular",
  },
  charCount: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    fontFamily: "Figtree-Regular",
  },
  imagesTitle: {
    fontSize: 16,
    fontFamily: "Figtree-Medium",
    marginBottom: 12,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    gap: 12,
    marginTop: 12,
  },
  imageWrapper: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 12,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  uploadButton: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 16,
  },
  uploadText: {
    color: "#666",
    fontSize: 12,
    fontFamily: "Figtree-Regular",
    marginTop: 12,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  postButton: {
    backgroundColor: "#0066CC",
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    minWidth: "50%",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Figtree-Medium",
  },
});

export default UseAIFinalStep;
