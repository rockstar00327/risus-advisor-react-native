import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");

const UploadGallery = ({ navigation, route }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const { post } = route.params;

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
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
      console.log("Error picking image:", error);
    }
  };

  const handleNext = () => {
    navigation.navigate("GalleryStep2", {
      selectedImages: selectedImages,
      postId: post.id,
    });
  };

  return (
    <View style={{ flex: 1 }}>
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
              Upload Images{"\n"}from gallery
            </Text>
            <Text style={[styles.stepLabel, { marginLeft: -15 }]}>
              Edit your{"\n"}image
            </Text>
            <Text style={styles.stepLabel}>Review and{"\n"}Post</Text>
          </View>
        </View>

        {/* Upload Section */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Select Images</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={handleImagePick}>
            <Ionicons name="image-outline" size={32} color="#666" />
            <Text style={styles.uploadText}>
              Upload Images from{"\n"}gallery
            </Text>
          </TouchableOpacity>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedImages.length > 0 && styles.activeNextButton,
          ]}
          onPress={handleNext}
          disabled={selectedImages.length === 0}
        >
          <Text
            style={[
              styles.nextButtonText,
              selectedImages.length > 0 && styles.activeNextButtonText,
            ]}
          >
            Next
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
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
  uploadSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Figtree-Medium",
    marginBottom: 16,
  },
  uploadBox: {
    flex: 1,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
  },
  uploadText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontFamily: "Figtree-Regular",
  },
  nextButton: {
    backgroundColor: "#E0E0E0",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  activeNextButton: {
    backgroundColor: "#0066CC",
  },
  nextButtonText: {
    color: "#666",
    fontSize: 16,
    fontFamily: "Figtree-Medium",
  },
  activeNextButtonText: {
    color: "#fff",
  },
});

export default UploadGallery;
