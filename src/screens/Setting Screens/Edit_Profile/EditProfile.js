import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Platform,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import CustomAlert from "../../../components/CustomAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../../constant/BaseConst";
import { useNavigation } from "@react-navigation/native";
import Calendar from "./Calendar";

const EditProfile = () => {
  const navigation = useNavigation();
  const [cover_image, setcover_image] = useState(
    require("../../../assets/DummyImage/DummyCover.png")
  );
  const [image, setimage] = useState(
    require("../../../assets/DummyImage/DummyProfile.png")
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [alert, setAlert] = useState({ visible: false, type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    aboutMe: "",
    // currentPosition: {
    //   title: "",
    //   company: "",
    // },
    // education: {
    //   universityName: "",
    //   graduationDate: "",
    // },
  });

  const [positions, setPositions] = useState([{ title: "", company: "" }]);
  const [educations, setEducations] = useState([
    { universityName: "", graduationDate: "" },
  ]);

  const [showCalendar, setShowCalendar] = useState(false);
  const [activeEducationIndex, setActiveEducationIndex] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const authToken = await AsyncStorage.getItem("authToken");
        const response = await axios.get(`${BASE_URL}/api/user/profile/`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        console.log(response.data);

        // Update form data with existing user data
        setFormData({
          firstName: response.data.first_name || "",
          lastName: response.data.last_name || "",
          username: response.data.username || "",
          email: response.data.email || "",
          phoneNumber: response.data.phone_number || "",
          aboutMe: response.data.summary || "",
        });

        // Set positions and educations arrays
        setPositions([
          {
            title: response.data.designation || "",
            company: response.data.company_name || "",
          },
        ]);

        setEducations([
          {
            universityName: response.data.study || "",
            graduationDate: formatDateForDisplay(
              response.data.graduation_date || ""
            ),
          },
        ]);

        if (response.data.cover_image) {
          setcover_image({ uri: response.data.cover_image });
        }
        if (response.data.image) {
          setimage({ uri: response.data.image });
        }
        if (response.data.date_of_birth) {
          setDate(new Date(response.data.date_of_birth));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setAlert({
          visible: true,
          type: "error",
          message: "Failed to load profile data",
        });
      }
    };

    fetchUserProfile();
  }, []);

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";

    // If already in YYYY-MM-DD format, convert to DD/MM/YYYY for display
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-");
      return `${year}-${month}-${day}`;
    }

    return dateString;
  };

  const pickImage = async (type) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "cover" ? [16, 9] : [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === "cover") {
        setcover_image({ uri: result.assets[0].uri });
      } else {
        setimage({ uri: result.assets[0].uri });
      }
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const addPosition = () => {
    setPositions([...positions, { title: "", company: "" }]);
  };

  const addEducation = () => {
    setEducations([...educations, { universityName: "", graduationDate: "" }]);
  };

  const updatePosition = (index, field, value) => {
    const updatedPositions = [...positions];
    updatedPositions[index] = { ...updatedPositions[index], [field]: value };
    setPositions(updatedPositions);
  };

  // Function to update education at specific index
  const updateEducation = (index, field, value) => {
    const updatedEducations = [...educations];
    updatedEducations[index] = { ...updatedEducations[index], [field]: value };
    setEducations(updatedEducations);
  };

  // Add this function to handle date selection
  const handleDateSelect = (date) => {
    if (activeEducationIndex !== null && date) {
      // Format date as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      const updatedEducations = [...educations];
      updatedEducations[activeEducationIndex] = {
        ...updatedEducations[activeEducationIndex],
        graduationDate: formattedDate,
      };
      setEducations(updatedEducations);
    }
  };

  const handleSave = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const formDataToSend = new FormData();
    const newImageSelected =
      image.uri &&
      image.uri !== require("../../../assets/DummyImage/DummyProfile.png").uri;
    const newCoverImageSelected =
      cover_image.uri &&
      cover_image.uri !==
        require("../../../assets/DummyImage/DummyCover.png").uri;

    // Use the first position and education (or empty strings if none exist)
    const currentPosition = positions[0] || { title: "", company: "" };
    const currentEducation = educations[0] || {
      universityName: "",
      graduationDate: "",
    };

    // Prepare all fields in the required format
    formDataToSend.append("summary", formData.aboutMe || "");
    formDataToSend.append("firstName", formData.firstName || "");
    formDataToSend.append("lastName", formData.lastName || "");
    formDataToSend.append("email", formData.email || "");
    formDataToSend.append("phoneNumber", formData.phoneNumber || "");
    formDataToSend.append("dateOfBirth", date.toISOString().split("T")[0]);
    formDataToSend.append("country", "Bangladesh");
    formDataToSend.append("designation", currentPosition.title || "");
    formDataToSend.append("companyName", currentPosition.company || "");
    formDataToSend.append("study", currentEducation.universityName || "");

    formDataToSend.append(
      "graduationDate",
      currentEducation.graduationDate || ""
    );

    // Validation for required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phoneNumber ||
      !currentPosition.title ||
      !currentPosition.company ||
      !currentEducation.universityName ||
      !currentEducation.graduationDate
    ) {
      setAlert({
        visible: true,
        type: "warning",
        message:
          "Please fill in all required fields including current position and education details",
      });
      setIsLoading(false);
      return;
    }
    try {
      const authToken = await AsyncStorage.getItem("authToken");

      // Handle cover image if changed
      if (newCoverImageSelected) {
        const coverImageFile = {
          uri:
            Platform.OS === "ios"
              ? cover_image.uri.replace("file://", "")
              : cover_image.uri,
          type: "image/jpeg",
          name: "cover_image.jpg",
        };
        formDataToSend.append("cover_image", coverImageFile);
      }

      // Handle profile image if changed
      if (newImageSelected) {
        const profileImageFile = {
          uri:
            Platform.OS === "ios"
              ? image.uri.replace("file://", "")
              : image.uri,
          type: "image/jpeg",
          name: "profile_image.jpg",
        };
        formDataToSend.append("image", profileImageFile);
      }

      // Log the form data being sent (for debugging)
      console.log("FormData contents:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(
        `${BASE_URL}/api/user/profile/update/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200) {
        setAlert({
          visible: true,
          type: "success",
          message: "Profile updated successfully!",
        });
        setTimeout(
          () =>
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "MainTabs",
                  state: { routes: [{ name: "Settings" }] },
                },
              ],
            }),
          2000
        );
      }
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      setAlert({
        visible: true,
        type: "error",
        message:
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to update profile. Please check all required fields.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {showCalendar ? (
        <StatusBar
          backgroundColor="#000"
          translucent
          barStyle="light-content"
        />
      ) : (
        <StatusBar
          backgroundColor="#000"
          translucent
          barStyle="light-content"
        />
      )}

      <CustomAlert
        type={alert.type}
        message={alert.message}
        visible={alert.visible}
        onClose={() => setAlert({ ...alert, visible: false })}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        decelerationRate="normal"
        overScrollMode="never"
        keyboardDismissMode="on-drag"
        removeClippedSubviews={true}
      >
        {/* Cover Image with Back Button Overlay */}
        <View style={styles.coverContainer}>
          <Image
            source={cover_image}
            style={styles.cover_image}
            resizeMethod="resize"
          />
          <TouchableOpacity
            style={styles.cameraBtnCover}
            onPress={() => pickImage("cover")}
          >
            <Feather name="camera" size={20} color="#fff" />
          </TouchableOpacity>
          {/* Back button overlaid on cover */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Profile Image - Updated position */}
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} />
          <TouchableOpacity
            style={styles.cameraBtnProfile}
            onPress={() => pickImage("profile")}
          >
            <Feather name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.nameContainer}>
            <View style={styles.halfInputContainer}>
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(text) =>
                  setFormData({ ...formData, firstName: text })
                }
                placeholder="First Name"
              />
            </View>
            <View style={styles.halfInputContainer}>
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(text) =>
                  setFormData({ ...formData, lastName: text })
                }
                placeholder="Last Name"
              />
            </View>
          </View>

          {/* <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={formData.username}
              onChangeText={(text) =>
                setFormData({ ...formData, username: text })
              }
              placeholder="@username"
            />
          </View> */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={formData.phoneNumber}
              onChangeText={(text) =>
                setFormData({ ...formData, phoneNumber: text })
              }
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>About me</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={formData.aboutMe}
              onChangeText={(text) =>
                setFormData({ ...formData, aboutMe: text })
              }
              multiline
              placeholder="Just a camera, a cup of coffee, and a love for freezing memories in motion."
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.sectionHeader}>
              <Text style={styles.label}>Current Position</Text>
              <TouchableOpacity onPress={addPosition}>
                <Text style={styles.addButtonText}>+ Add another</Text>
              </TouchableOpacity>
            </View>
            {positions.map((position, index) => (
              <View key={index} style={styles.positionGroup}>
                <Text style={styles.sublabel}>Title</Text>
                <TextInput
                  style={styles.input}
                  value={positions[0]?.title || ""}
                  onChangeText={(text) => updatePosition(0, "title", text)}
                  placeholder="Senior Adviser"
                />
                <Text style={styles.sublabel}>Company</Text>
                <TextInput
                  style={styles.input}
                  value={positions[0]?.company || ""}
                  onChangeText={(text) => updatePosition(0, "company", text)}
                  placeholder="ABC Ltd."
                />
              </View>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.sectionHeader}>
              <Text style={styles.label}>Education</Text>
              <TouchableOpacity onPress={addEducation}>
                <Text style={styles.addButtonText}>+ Add another</Text>
              </TouchableOpacity>
            </View>
            {educations.map((education, index) => (
              <View key={index} style={styles.educationGroup}>
                <Text style={styles.sublabel}>University/College Name</Text>
                <TextInput
                  style={styles.input}
                  value={educations[0]?.universityName || ""}
                  onChangeText={(text) =>
                    updateEducation(0, "universityName", text)
                  }
                  placeholder="University of XYZ"
                />
                <Text style={styles.sublabel}>Graduation (Expected)</Text>
                <View style={styles.dateInputContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setActiveEducationIndex(0);
                      setShowCalendar(true);
                    }}
                  >
                    <TextInput
                      style={[styles.input, styles.dateInput]}
                      value={
                        formatDateForDisplay(educations[0]?.graduationDate) ||
                        ""
                      }
                      placeholder="DD/MM/YYYY"
                      editable={false}
                      pointerEvents="none"
                    />
                    <View style={styles.calendarIcon}>
                      <Feather name="calendar" size={20} color="#666" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                isLoading && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#FFF" />
                  <Text style={[styles.saveButtonText, styles.loadingText]}>
                    Saving...
                  </Text>
                </View>
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Calendar
        isVisible={showCalendar}
        onClose={() => {
          setShowCalendar(false);
          setActiveEducationIndex(null);
        }}
        onDateSelect={(date) => {
          handleDateSelect(date);
          if (Platform.OS === "ios") {
            setShowCalendar(false);
            setActiveEducationIndex(null);
          }
        }}
        selectedDate={
          activeEducationIndex !== null &&
          educations[activeEducationIndex].graduationDate
            ? new Date(
                educations[activeEducationIndex].graduationDate
                  .split("-")
                  .join("-") // Already in YYYY-MM-DD format
              )
            : new Date()
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingBottom: 20,
    paddingTop: 0,
    flexDirection: "column",
  },
  coverContainer: {
    height: 200,
    width: "100%",
    position: "relative",
    marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    backgroundColor: "#fff",
  },
  cover_image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 2,
    backgroundColor: "rgba(0, 0, 0,0.5)",
    borderRadius: 20,
  },
  cameraBtnCover: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 20,
  },
  imageContainer: {
    position: "relative",
    marginTop: -50,
    marginLeft: 20,
    alignSelf: "flex-start",
    zIndex: 2,
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3.5,
    borderColor: "#fff",
  },
  cameraBtnProfile: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 15,
  },
  formSection: {
    paddingHorizontal: 20,
    paddingTop: 0,
    backgroundColor: "#fff",
  },
  inputGroup: {
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Figtree-Medium",
    marginBottom: 10,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  halfInputContainer: {
    flex: 1,
    marginRight: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    fontFamily: "Figtree-Regular",
    backgroundColor: "#FFF",
    marginBottom: 16,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sublabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    fontFamily: "Figtree-Regular",
  },
  addButtonText: {
    color: "#0066CC",
    fontSize: 14,
    fontFamily: "Figtree-Medium",
  },
  positionGroup: {
    marginBottom: 8,
  },
  educationGroup: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginLeft: 10,
    backgroundColor: "#0063AC",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Figtree-Medium",
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Figtree-Medium",
  },
  dateInputContainer: {
    position: "relative",
    width: "100%",
  },
  dateInput: {
    backgroundColor: "#FFF",
    color: "#333",
    paddingRight: 40,
  },
  calendarIcon: {
    position: "absolute",
    right: 12,
    top: "35%",
    transform: [{ translateY: -10 }],
  },
  saveButtonDisabled: {
    backgroundColor: "#0063AC80",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginLeft: 8,
  },
});

export default EditProfile;
