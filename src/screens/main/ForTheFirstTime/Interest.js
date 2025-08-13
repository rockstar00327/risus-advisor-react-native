import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CustomAlert from "../../../components/CustomAlert";
import { BASE_URL } from "../../../constant/BaseConst";

const Interest = ({ navigation, setHasCompletedInterests }) => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "",
    message: "",
  });

  const showAlert = (type, message) => {
    setAlertConfig({
      visible: true,
      type,
      message,
    });
  };

  const hideAlert = () => {
    setAlertConfig((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user/interests/`);
      console.log(response.data);
      setInterests(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching interests:",
        error.response?.data || error.message
      );
      setLoading(false);
    }
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest.id)
        ? prev.filter((item) => item !== interest.id)
        : [...prev, interest.id]
    );
  };

  const handleContinue = async () => {
    // if (selectedInterests.length < 3) {
    //   showAlert("warning", "Please select at least 3 interests to continue");
    //   return;
    // }

    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.post(
        `${BASE_URL}/api/user/interests/`,
        {
          interest_ids: selectedInterests,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message === "interests added") {
        // First show success alert
        showAlert("success", "Your interests have been saved successfully!");
        //setHasCompletedInterests(false);

        // Set the completion flag
        await AsyncStorage.setItem("hasCompletedInterests", "false");

        // Wait for the alert to be visible before navigating
        setTimeout(() => {
          try {
            // Check if navigation is available
            if (navigation && navigation.reset) {
              navigation.reset({
                index: 0,
                routes: [
                  { name: "MainTabs", state: { routes: [{ name: "Home" }] } },
                ],
              });
            } else {
              console.error("Navigation object is not properly initialized");
            }
          } catch (navError) {
            console.error("Navigation error:", navError);
          }
        }, 1500);
      }
    } catch (error) {
      console.error(
        "Error saving interests:",
        error.response?.data || error.message
      );
      showAlert("error", "Failed to save your interests. Please try again.");
    }
  };

  // const handleCompleteInterests = async () => {
  //   try {
  //     // Save interests logic here
  //     await AsyncStorage.setItem('hasCompletedInterests', 'true');
  //     navigation.replace('MainTabs');
  //   } catch (error) {
  //     console.error('Error completing interests:', error);
  //   }
  // };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading interests...</Text>
      </View>
    );
  }

  console.log(selectedInterests);

  return (
    <View style={styles.container}>
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        message={alertConfig.message}
        onClose={hideAlert}
      />

      <Text style={styles.title}>Choose Your Interests</Text>
      <Text style={styles.subtitle}>
        Select at least 3 topics you're interested in
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.interestsContainer}
      >
        <View style={styles.interestsGrid}>
          {interests.map((interest) => (
            <TouchableOpacity
              key={interest.id}
              style={[
                styles.interestItem,
                selectedInterests.includes(interest.id) && styles.selectedItem,
              ]}
              onPress={() => toggleInterest(interest)}
            >
              <Image
                source={{ uri: `${BASE_URL}${interest.image}` }}
                style={styles.interestImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.interestText,
                  selectedInterests.includes(interest.id) &&
                    styles.selectedText,
                ]}
              >
                {interest.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.continueButton,
          selectedInterests.length >= 3 && styles.activeButton,
        ]}
        onPress={handleContinue}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    padding: 24,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontFamily: "Figtree-Medium",
    textAlign: "center",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Figtree-Regular",
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 22,
  },
  interestsContainer: {
    flex: 1,
    marginVertical: 10,
  },
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    gap: 12,
  },
  interestItem: {
    width: "48%",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 8,
  },
  selectedItem: {
    borderRadius: 8,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderBottomWidth: 3,
    borderColor: "#CEEAFF",
  },
  interestImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  interestText: {
    color: "#333",
    fontSize: 15,
    fontFamily: "Figtree-Bold",
  },
  selectedText: {
    color: "#000",
  },
  continueButton: {
    backgroundColor: "#CEEAFF",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 10,
  },
  activeButton: {
    backgroundColor: "#CEEAFF",
  },
  continueText: {
    color: "#000",
    fontSize: 17,
    fontFamily: "Figtree-Bold",
    letterSpacing: 0.5,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 8,
    zIndex: 1,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});

export default Interest;
