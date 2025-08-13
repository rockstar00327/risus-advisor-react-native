import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
  ScrollView,
  Platform,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AiMagicButton from "../../../components/buttons/AiMagicButton";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_SOCKET_URL, BASE_URL } from "../../../constant/BaseConst";
import CustomAlert from "../../../components/CustomAlert";
import { useNavigation, useRoute } from "@react-navigation/native";

const UseAIStep1 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { post } = route.params;
  const [description, setDescription] = useState("");
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageTimeout, setImageTimeout] = useState(null);
  const [alert, setAlert] = useState({
    visible: false,
    type: "",
    message: "",
  });

  const handleGenerateImages = async () => {
    if (!description.trim()) {
      setAlert({
        visible: true,
        type: "error",
        message: "Please give a description about AI image",
      });
      console.log("Alert set:", alert); // Debugging output
      return;
    }
    setIsImageLoading(true);
    setIsGenerating(true);
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/repost/${post.id}/generate-images/`,
        {
          prompt: description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      if (response.data) {
      }

      // console.log(response.data.images);

      //setGeneratedImages(response.data.images);
    } catch (error) {
      console.error("Error generating images:", error);
      setAlert({
        visible: true,
        type: "error",
        message: "Failed to generate images. Please try again.",
      });
    } finally {
      setIsGenerating(false);
      //setIsImageLoading(true);
    }
  };

  const connectWebSocket = async () => {
    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      console.log("No token found, cannot connect to WebSocket.");
      return;
    }

    const ws = new WebSocket(`${BASE_SOCKET_URL}/connect-ai/?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket connected!");
      setIsImageLoading(true);
    };

    ws.onmessage = (event) => {
      console.log(event.data);
      try {
        const data = JSON.parse(event.data);
        if (data.url) {
          setGeneratedImages((prevImages) => [...prevImages, data.url]); // Append new image URL

          // Restart timeout to track when images stop arriving
          if (imageTimeout) clearTimeout(imageTimeout);
          setImageTimeout(setTimeout(() => setIsImageLoading(false), 3000)); // Stop loader after 3s of inactivity
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.warn("WebSocket closed!", event.code, event.reason);
      setIsImageLoading(false);
    };

    return ws;
  };

  useEffect(() => {
    const ws = connectWebSocket();

    return () => {
      ws?.then((socket) => socket.close()); // Cleanup WebSocket connection on unmount
    };
  }, []);

  const toggleImageSelection = (index) => {
    setSelectedImages((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }
      return [...prev, index];
    });
  };

  const handleNext = () => {
    if (selectedImages.length > 0) {
      navigation.navigate("UseAIStep2", {
        selectedImages: selectedImages.map((index) => generatedImages[index]),
        title: description,
        postId: post.id,
      });
    }
  };

  //console.log(post);

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
          <View style={[styles.step, styles.activeStep]}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
        </View>
        <View style={styles.stepLabelRow}>
          <Text style={styles.stepLabel_active}>
            Generate and{"\n"}Choose Image
          </Text>
          <Text style={[styles.stepLabel, { marginLeft: -15 }]}>
            Edit and{"\n"}Caption
          </Text>
          <Text style={styles.stepLabel}>Review and{"\n"}Post</Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Generate images with AI</Text>
          <AiMagicButton />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Describe the image you want"
            multiline
            value={description}
            onChangeText={setDescription}
            maxLength={250}
          />
          <Text style={styles.charCount}>{description.length}/250</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.generateButton,
            isGenerating && styles.generatingButton,
          ]}
          onPress={handleGenerateImages}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.generateButtonText}>
              {generatedImages.length > 0
                ? "Generate Again"
                : "Generate Images"}
            </Text>
          )}
        </TouchableOpacity>

        {generatedImages.length > 0 && (
          <>
            <Text style={styles.selectImagesText}>Select Images</Text>
            <View style={styles.imageGrid}>
              {generatedImages.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleImageSelection(index)}
                  style={styles.imageWrapper}
                >
                  <Image
                    source={{ uri: image }}
                    style={styles.generatedImage}
                  />
                  <View
                    style={[
                      styles.selectionIndicator,
                      selectedImages.includes(index) && styles.selected,
                    ]}
                  >
                    <View style={styles.checkmark} />
                  </View>
                </TouchableOpacity>
              ))}
              {isImageLoading && (
                <ActivityIndicator
                  size="small"
                  color="#0066CC"
                  style={styles.loaderBesideImages}
                />
              )}
              <TouchableOpacity
                style={styles.generateMoreButton}
                onPress={handleGenerateImages}
              >
                <Text style={styles.generateMoreText}>
                  Generate more{"\n"}images
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedImages.length > 0 && styles.nextButtonActive,
          ]}
          onPress={handleNext}
        >
          <Text
            style={[
              styles.nextButtonText,
              selectedImages.length > 0 && styles.nextButtonTextActive,
            ]}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
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
  stepNumber: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Figtree-Medium",
  },
  stepLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 8,
  },
  stepLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 8,
  },
  stepLabel_active: {
    fontSize: 12,
    textAlign: "center",
    color: "#0066CC",
    fontFamily: "Figtree-Regular",
  },
  stepLabel: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
    fontFamily: "Figtree-Regular",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: "Figtree-Medium",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
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
  generateButton: {
    backgroundColor: "#0066CC",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  generatingButton: {
    backgroundColor: "#E0E0E0",
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Figtree-Medium",
  },
  selectImagesText: {
    fontSize: 16,
    fontFamily: "Figtree-Medium",
    marginTop: 24,
    marginBottom: 8,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
    paddingBottom: 20,
  },
  imageWrapper: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  generatedImage: {
    width: "100%",
    height: "100%",
  },
  selectionIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderWidth: 1,
    borderColor: "#0066CC",
  },
  selected: {
    backgroundColor: "#0066CC",
  },
  checkmark: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#0066CC",
  },
  generateMoreButton: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  generateMoreText: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    fontFamily: "Figtree-Regular",
  },
  bottomButtons: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginRight: 12,
  },
  cancelButtonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Figtree-Medium",
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  nextButtonActive: {
    backgroundColor: "#0066CC",
  },
  nextButtonText: {
    color: "#666",
    fontSize: 16,
    fontFamily: "Figtree-Medium",
  },
  nextButtonTextActive: {
    color: "#fff",
  },
  bottomSpacing: {
    height: 100,
  },
  loader: {
    marginVertical: 20,
  },
});

export default UseAIStep1;
