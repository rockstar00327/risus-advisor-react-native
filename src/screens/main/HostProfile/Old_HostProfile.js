import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    TouchableOpacity,
    ScrollView,
    Platform,
    ActivityIndicator,
    StatusBar
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { useNavigation } from "@react-navigation/native";
  import HostContributions from "./HostContributions";
  import MaterialIcons from "react-native-vector-icons/MaterialIcons";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { BASE_URL } from "../../../constant/BaseConst";
  import {
    AntDesign,
    Feather,
    Ionicons,
    FontAwesome,
    Entypo,
  } from "@expo/vector-icons";
  import Highlights from "./Highlights ";
  import Profile3dot from "./Profile3dot";
  import axios from "axios";
  import Toast from "../../../components/Toast/Toast";
  import MessagePopup from "./MessagePopup";
  
  const Old_HostProfile = ({ route }) => {
    const navigation = useNavigation();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = route?.params || {};
    const [isBridged, setIsBridged] = React.useState(false);
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showMsgPopup, setShowMsgPopup] = useState(false);
    // console.log(user);
  
    const fetchUserProfile = async () => {
      const token = await AsyncStorage.getItem("authToken");
      try {
        const response = await fetch(
          `${BASE_URL}/api/user/visit/${user.user_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );
        const result = await response.json();
        //console.log(result);
        if (response.ok) {
          setUserInfo(result);
          setLoading(false);
        }
        // console.log(result.results);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    const showToast = (message) => {
      setToastMessage(message);
      setToastVisible(true);
    };
  
    useEffect(() => {
      fetchUserProfile();
    }, [userInfo]);
  
    const handleBridge = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const url = `${BASE_URL}/api/user/bridge/`;
        //console.log(url);
        const response = await axios.post(
          url,
          { bridged_user: userInfo?.id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );
        //console.log(response);
        if (response.status === 201) {
          console.log("Bridged successfully!");
  
          // Update userInfo with new is_bridge value
          setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            is_bridged: response.data.accepted,
          }));
        }
      } catch (err) {
        console.log(err);
        console.log("Failed to bridge");
      }
      // setIsBridged(!isBridged);
      // add API calls or other logic here
    };
    //console.log(userInfo?.is_bridged);
  
    return (
      <SafeAreaView style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0077B5" style={styles.loader} />
        ) : (
          userInfo && (
            <View>
              {/* Header with Back Button */}
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                >
                  <MaterialIcons
                    name="arrow-back-ios"
                    size={24}
                    color="#000"
                    style={{ marginLeft: 5 }}
                  />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
                  <Text style={styles.headerTitle}>
                    {userInfo?.first_name}'s Profile
                  </Text>
                </View>
                {/* <View style={styles.settingsButton}>
                <Feather name="settings" size={24} color="#000" />
              </View> */}
              </View>
  
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Cover Image */}
                <View style={styles.coverContainer}>
                  {userInfo?.cover_image ? (
                    <Image
                      source={{ uri: userInfo?.cover_image }}
                      style={styles.coverImage}
                    />
                  ) : (
                    <Image
                      source={require("../../../assets/ProfileScreenImages/Cover.jpg")}
                      style={styles.coverImage}
                    />
                  )}
                </View>
  
                {/* Profile Section */}
                <View style={styles.profileSection}>
                  <View style={styles.profileImageContainer}>
                    {userInfo?.image ? (
                      <Image
                        source={{ uri: userInfo?.image }}
                        style={styles.profileImage}
                      />
                    ) : (
                      <Image
                        source={require("../../../assets/ProfileScreenImages/Profile.jpg")}
                        style={styles.profileImage}
                      />
                    )}
                  </View>
  
                  <View style={styles.profileInfo}>
                    <Text style={styles.name}>
                      {userInfo?.first_name && userInfo?.last_name
                        ? `${userInfo?.first_name} ${userInfo?.last_name}`
                        : "No Name Given"}
                    </Text>
                    <Text style={styles.headline}>
                      {userInfo?.achievements || "No Achievement Given"}
                    </Text>
  
                    <View style={styles.locationRow}>
                      <Entypo name="location-pin" size={16} color="#666" />
                      <Text style={styles.locationText}>
                        {userInfo?.location
                          ? userInfo?.location
                          : userInfo?.country
                          ? userInfo?.country
                          : "Location not specified"}
                      </Text>
                    </View>
  
                    {/* <View style={styles.connectionInfo}>
                  <Ionicons name="people" size={16} color="#666" />
                  <Text style={styles.connectionsText}>134k Bridged</Text>
                </View> */}
  
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={[
                          styles.connectButton,
                          userInfo?.is_bridged && { backgroundColor: "#CEEAFF" },
                        ]}
                        onPress={handleBridge}
                      >
                        <Text
                          style={[
                            styles.connectButtonText,
                            userInfo?.is_bridged && { color: "#000" },
                          ]}
                        >
                          {userInfo?.is_bridged ? "Bridged" : "Bridge"}
                        </Text>
                        {userInfo?.is_bridged ? (
                          <MaterialIcons
                            name="handshake"
                            size={20}
                            color="#000"
                          />
                        ) : (
                          <MaterialIcons name="people" size={20} color="#666" />
                        )}
                      </TouchableOpacity>
  
                      <TouchableOpacity
                        style={styles.messageButton}
                        onPress={() => setShowMsgPopup((prev) => !prev)}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <Text style={styles.messageButtonText}>Message</Text>
                          <MaterialIcons
                            name="chat-bubble-outline"
                            size={20}
                            color="#666"
                          />
                        </View>
                      </TouchableOpacity>
                      <View style={{ flex: 1, alignItems: "flex-end" }}>
                        <TouchableOpacity
                          onPress={() => setShowProfileOptions(true)}
                        >
                          <Ionicons
                            name="ellipsis-horizontal"
                            size={24}
                            color="#666"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
                {showMsgPopup && (
                  <MessagePopup
                    isVisible={showMsgPopup}
                    onClose={() => setShowMsgPopup(false)}
                    userInfo={userInfo}
                    showToast={showToast}
                  />
                )}
                {/* Dashboard Section */}
                <View style={styles.dashboardSection}>
                  <View style={styles.dashboardItem}>
                    <Text style={styles.dashboardNumber}>
                      {userInfo?.total_contribution >= 1000
                        ? (userInfo?.total_contribution / 1000).toFixed(
                            userInfo?.total_contribution % 1000 === 0 ? 0 : 1
                          ) + "K"
                        : userInfo?.total_contribution}
                    </Text>
                    <Text style={styles.dashboardLabel}>Contributions</Text>
                  </View>
                  <View style={styles.dashboardDivider} />
                  <TouchableOpacity
                    style={styles.dashboardItem}
                    onPress={() =>
                      navigation.navigate("NumFollowerScreen", {
                        userId: userInfo?.id,
                      })
                    }
                  >
                    <Text style={styles.dashboardNumber}>
                      {userInfo?.total_followers >= 1000
                        ? (userInfo?.total_followers / 1000).toFixed(
                            userInfo?.total_followers % 1000 === 0 ? 0 : 1
                          ) + "K"
                        : userInfo?.total_followers}
                    </Text>
                    <Text style={styles.dashboardLabel}>Bridged</Text>
                  </TouchableOpacity>
                  {/* <View style={styles.dashboardDivider} /> */}
                  {/* <View style={styles.dashboardItem}>
  
                <Text style={styles.dashboardNumber}>230K</Text>
                <Text style={styles.dashboardLabel}>Votes</Text>
              </View> */}
                </View>
  
                {/* About Section */}
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>About</Text>
                  {userInfo?.summary ? (
                    <Text style={styles.aboutText}>{userInfo?.summary}</Text>
                  ) : (
                    <Text style={styles.aboutText}>
                      No advice, suggestions, recommendations, or guidance of any
                      kind are given, provided, shared, or offered by this host in
                      any way.
                    </Text>
                  )}
                </View>
  
                {/* Activity Section */}
                {/* <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Activity</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.activitySubtitle}>
                {userInfo?.first_name || "User"} has {userInfo?.posts?.length || 0} posts
              </Text> */}
  
                {/* Highlights Section - Renamed to Featured */}
                {/* <Text style={styles.featuredTitle}>Featured</Text>
              <Highlights user={userInfo} />
            </View> */}
  
                {/* Experience Section */}
                {/* <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Experience</Text>
                <TouchableOpacity style={styles.addButton}>
                  <AntDesign name="plus" size={20} color="#0077B5" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.experienceItem}>
                <View style={styles.companyLogoContainer}>
                  <FontAwesome name="building" size={24} color="#0077B5" />
                </View>
                <View style={styles.experienceDetails}>
                  <Text style={styles.experienceTitle}>Current Position</Text>
                  <Text style={styles.experienceCompany}>Company Name</Text>
                  <Text style={styles.experienceDuration}>Jan 2020 - Present • 3 yrs</Text>
                  <Text style={styles.experienceLocation}>Location</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.seeMoreButton}>
                <Text style={styles.seeMoreText}>Show all experiences</Text>
              </TouchableOpacity>
            </View> */}
  
                {/* Education Section */}
                {/* <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Education</Text>
                <TouchableOpacity style={styles.addButton}>
                  <AntDesign name="plus" size={20} color="#0077B5" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.experienceItem}>
                <View style={styles.companyLogoContainer}>
                  <FontAwesome name="graduation-cap" size={24} color="#0077B5" />
                </View>
                <View style={styles.experienceDetails}>
                  <Text style={styles.experienceTitle}>University Name</Text>
                  <Text style={styles.experienceCompany}>Degree, Field of Study</Text>
                  <Text style={styles.experienceDuration}>2016 - 2020</Text>
                </View>
              </View>
            </View> */}
  
                {/* Skills Section */}
                {/* <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <TouchableOpacity style={styles.addButton}>
                  <AntDesign name="plus" size={20} color="#0077B5" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.skillItem}>
                <Text style={styles.skillName}>Skill 1</Text>
                <Text style={styles.skillEndorsements}>5 endorsements</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.skillItem}>
                <Text style={styles.skillName}>Skill 2</Text>
                <Text style={styles.skillEndorsements}>3 endorsements</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.skillItem}>
                <Text style={styles.skillName}>Skill 3</Text>
                <Text style={styles.skillEndorsements}>1 endorsement</Text>
              </View>
              
              <TouchableOpacity style={styles.seeMoreButton}>
                <Text style={styles.seeMoreText}>Show all skills</Text>
              </TouchableOpacity>
            </View> */}
  
                {/* Posts Section */}
                <HostContributions
                  user={userInfo}
                  setToastMessage={setToastMessage}
                  setToastVisible={setToastVisible}
                />
              </ScrollView>
            </View>
          )
        )}
        <Profile3dot
          visible={showProfileOptions}
          onClose={() => setShowProfileOptions(false)}
          hostProfile={{
            id: userInfo?.id,
            username: userInfo?.username,
            displayName: userInfo?.display_name,
            isBridged: userInfo?.is_bridged, // Replace with actual bridged status
            profileLink:
              userInfo?.profile_link ||
              `https://yourapp.com/profile/${userInfo?.username}`,
          }}
        />
        <Toast
          visible={toastVisible}
          message={toastMessage}
          onDismiss={() => setToastVisible(false)}
        />
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: "#f3f2ef",
      backgroundColor: "#fff",
      paddingBottom: 20,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 15,
      paddingTop: Platform.OS === "ios" ? 10 : 0,
      paddingVertical: 5,
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: "Figtree-Bold",
    },
    backButton: {
      padding: 8,
      borderRadius: 20,
    },
    settingsButton: {
      padding: 8,
    },
    coverContainer: {
      position: "relative",
      height: 135,
    },
    coverImage: {
      width: "100%",
      height: 150,
    },
    profileSection: {
      backgroundColor: "#fff",
      paddingHorizontal: 16,
      paddingBottom: 10,
      // borderBottomWidth: 1,
      // borderBottomColor: "#e0e0e0",
    },
    profileImageContainer: {
      position: "relative",
      alignSelf: "flex-start",
      marginTop: -52,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 32,
      borderWidth: 4,
      borderColor: "#fff",
    },
    profileInfo: {
      marginTop: 10,
    },
    name: {
      fontSize: 20,
      fontFamily: "Figtree-Bold",
      color: "#000",
    },
    headline: {
      fontSize: 14,
      color: "#666",
      marginTop: 5,
      fontFamily: "Figtree-Regular",
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    locationText: {
      fontSize: 14,
      fontFamily: "Figtree-Regular",
      color: "#666",
      marginLeft: 5,
    },
    buttonRow: {
      flex: 1,
      flexDirection: "row",
      marginTop: 15,
      justifyContent: "space-between",
      alignItems: "center",
    },
    connectButton: {
      backgroundColor: "#fff",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#8cceff",
      marginRight: 8,
    },
    connectButtonText: {
      color: "#666",
      fontFamily: "Figtree-Bold",
      marginRight: 8,
    },
    messageButton: {
      backgroundColor: "#fff",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#666",
      marginRight: 8,
    },
    messageButtonText: {
      color: "#666",
      fontFamily: "Figtree-Bold",
    },
    moreButton: {
      padding: 1,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#666",
    },
    dashboardSection: {
      flexDirection: "row",
      backgroundColor: "#fff",
      marginTop: 8,
      padding: 16,
      borderRadius: 8,
      marginHorizontal: 16,
      // shadowColor: "#000",
      // shadowOffset: { width: 0, height: 1 },
      // shadowOpacity: 0.1,
      // shadowRadius: 2,
      // elevation: 2,
    },
    dashboardItem: {
      flex: 1,
      alignItems: "center",
    },
    dashboardDivider: {
      width: 3,
      borderRadius: 10,
      backgroundColor: "#e0e0e0",
      marginHorizontal: 10,
    },
    dashboardNumber: {
      fontSize: 18,
      fontFamily: "Figtree-Bold",
      color: "#000",
    },
    dashboardLabel: {
      fontSize: 13,
      color: "#000",
      marginTop: 4,
      fontFamily: "Figtree-Medium",
    },
    //about section basically
    sectionCard: {
      backgroundColor: "#fff",
      marginTop: 8,
      padding: 6,
      borderRadius: 8,
      marginHorizontal: 13,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: "Figtree-Bold",
      color: "#000",
    },
    aboutText: {
      fontSize: 14,
      fontFamily: "Figtree-Regular",
      color: "#000",
      lineHeight: 22,
      marginTop: 8,
    },
    loader: {
      marginVertical: 20,
    },
  });
  
  export default Old_HostProfile;
  