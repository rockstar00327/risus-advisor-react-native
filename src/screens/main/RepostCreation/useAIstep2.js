import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
  Platform,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const UseAIStep2 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const selectedImages = route.params?.selectedImages || [];
  const title = route.params?.title || [];
  const postId = route.params?.postId || [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = () => {
    console.log("Passing images to final step:", selectedImages);
    navigation.navigate("UseAIFinalStep", {
      selectedImages: selectedImages,
      title: title,
      postId: postId,
    });
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
          <View style={[styles.step, styles.activeStep]}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
        </View>
        <View style={styles.stepLabelRow}>
          <Text style={styles.stepLabel}>Generate and{"\n"}Choose Image</Text>
          <Text style={[styles.stepLabel_active, { marginLeft: -15 }]}>
            Edit and{"\n"}Caption
          </Text>
          <Text style={styles.stepLabel}>Review and{"\n"}Post</Text>
        </View>
      </View>

      <Text style={styles.title}>Edit Your Images</Text>

      <ScrollView horizontal pagingEnabled style={styles.imageScroller}>
        {selectedImages.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.editTools}>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="options" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="color-filter" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
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
  completedStep: {
    backgroundColor: "#4CAF50",
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
  title: {
    fontSize: 18,
    fontFamily: "Figtree-Medium",
    marginLeft: 16,
    marginBottom: 16,
  },
  imageScroller: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    paddingHorizontal: 16,
  },
  image: {
    width: "100%",
    height: width - 32,
    borderRadius: 8,
  },
  editTools: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 40,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "#0066CC",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Figtree-Medium",
  },
});

export default UseAIStep2;
