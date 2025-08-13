import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ShareIcon from "../../../components/buttons/UserProfileScreen_Icons/ShareIcon";
import StudyIcon from "../../../components/buttons/UserProfileScreen_Icons/StudyIcon";
import JobBag from "../../../components/buttons/UserProfileScreen_Icons/JobBag";
import CalendarIcon from "../../../components/buttons/UserProfileScreen_Icons/CalendarIcon";
import Posts from "./Posts";
import { useNavigation } from "@react-navigation/native";
import Profile3dot from "./Profile3dot";
import Reposts from "./Reposts";
import Reels from "./Reels";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../../constant/BaseConst";
import axios from "axios";
import MessagePopup from "./MessagePopup";

const { width } = Dimensions.get("window");

const HostProfile = ({ route }) => {
  const { user } = route?.params || {};
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("Posts");
  const [showOptions, setShowOptions] = useState(false);
  const [reposts, setReposts] = useState(null);
  const [reels, setReels] = useState(null);
  const [bridged, setBridged] = useState(false);
  const [showMsgPopup, setShowMsgPopup] = useState(false);

  // Dummy user data
  const userInfodemo = {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    username: "johndoe",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    cover_image: "https://images.unsplash.com/photo-1500964757637-c85e8a162699",
    bio: "Professional photographer and digital artist. Sharing my vision of the world through the lens.",
    designation: "Senior Photographer",
    company_name: "Creative Studios",
    study: "School of Visual Arts",
    posts: Array(15).fill({}),
    total_views: 25000,
    total_followers: 1500,
    total_following: 890,
    date_joined: "2023-07-31",
  };

  const fetchUserProfile = async () => {
    // setLoading(true);
    const token = await AsyncStorage.getItem("authToken");
    try {
      // const response = await fetch(
      //   `${BASE_URL}/api/user/visit/${user.user_id}`,
      //   {
      //     method: "GET",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Token ${token}`,
      //     },
      //   }
      // );
      // const result = await response.json();
      // //console.log(result);
      // if (response.ok) {
      //   setUserInfo(result);
      //   setLoading(false);
      // }

      const profileResponse = await fetch(
        `${BASE_URL}/api/user/visit/${user.user_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      const profileData = await profileResponse.json();

      if (profileResponse.ok) {
        setUserInfo(profileData);

        // 2. Then fetch reposts and reels in parallel
        const [repostsResponse, reelsResponse] = await Promise.all([
          fetch(
            `${BASE_URL}/api/user/${profileData.id}/get-user-posts/?q=reposts`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
              },
            }
          ),
          fetch(
            `${BASE_URL}/api/user/${profileData.id}/get-user-posts/?q=reels`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
              },
            }
          ),
        ]);

        const [repostsData, reelsData] = await Promise.all([
          repostsResponse.json(),
          reelsResponse.json(),
        ]);

        if (repostsResponse.ok) setReposts(repostsData.results);
        if (reelsResponse.ok) setReels(reelsData.results);
      }
      // console.log(result.results);
    } catch (err) {
      console.log(err);
    } finally {
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

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {loading ? (
        <ActivityIndicator size="large" color="#97D3FF" style={styles.loader} />
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Cover Image */}

          <Image
            source={{ uri: userInfo?.cover_image || userInfodemo.cover_image }}
            style={styles.coverImage}
          />

          {/* Back and Share buttons */}
          <View style={styles.topButtons}>
            <TouchableOpacity style={styles.iconButton} onPress={handleBack}>
              <Ionicons name="chevron-back-outline" size={21} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowOptions(true)}
            >
              <ShareIcon />
            </TouchableOpacity>
          </View>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileHeader}>
              <Image
                source={{ uri: userInfo?.image || userInfodemo.image }}
                style={styles.profileImage}
              />
              {/* <View style={styles.joinDateContainer}>
                <CalendarIcon />
                <Text style={styles.joinDate}>Since 31 July 2023</Text>
              </View> */}
            </View>

            <View style={styles.userInfo}>
              <View style={styles.nameSection}>
                <Text style={styles.userName}>
                  {userInfo?.first_name && userInfo?.last_name
                    ? `${userInfo?.first_name} ${userInfo?.last_name}`
                    : `${userInfodemo.first_name} ${userInfodemo.last_name}`}
                </Text>
                <TouchableOpacity
                  // onPress={() => setBridged((prev) => !prev)}
                  onPress={handleBridge}
                  style={[
                    styles.bridgeButton,
                    userInfo?.is_bridged && styles.bridgedButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.bridgeButtonText,
                      userInfo?.is_bridged && styles.bridgedButtonText,
                    ]}
                  >
                    {userInfo?.is_bridged ? "Bridged" : "Bridge"}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.userHandle}>
                @{userInfo?.username || userInfodemo.username}
              </Text>
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
                  <MaterialIcons
                    name="chat-bubble-outline"
                    size={20}
                    color="#666"
                    style={{ marginTop: 3 }}
                  />
                  <Text style={styles.messageButtonText}>Message</Text>
                </View>
              </TouchableOpacity>
              {showMsgPopup && (
                <MessagePopup
                  isVisible={showMsgPopup}
                  onClose={() => setShowMsgPopup(false)}
                  userInfo={userInfo}
                  showToast={showToast}
                />
              )}
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statGroup}>
                <Text style={styles.statNumber}>
                  {userInfo?.posts.length >= 1000
                    ? (userInfo?.posts.length / 1000).toFixed(1) + "K"
                    : userInfo?.posts.length}
                </Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.centerStats}>
                <View style={[styles.statGroup, { marginRight: 15 }]}>
                  <Text style={styles.statNumber}>
                    {userInfo?.total_views >= 1000
                      ? (userInfo?.total_views / 1000).toFixed(1) + "K"
                      : userInfo?.total_views}
                  </Text>
                  <Text style={styles.statLabel}>Votes</Text>
                </View>
                <View style={styles.divider} />
                <View style={[styles.statGroup, { marginLeft: 15 }]}>
                  <Text style={styles.statNumber}>
                    {userInfo?.total_followers >= 1000
                      ? (userInfo?.total_followers / 1000).toFixed(1) + "K"
                      : userInfo?.total_followers}
                  </Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("NumFollowerScreen", {
                    userId: userInfo?.id,
                  });
                }}
                style={styles.statGroup}
              >
                <Text style={styles.statNumber}>
                  {userInfo?.total_following >= 1000
                    ? (userInfo?.total_following / 1000).toFixed(1) + "K"
                    : userInfo?.total_following}
                </Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.userBio}>
              {userInfo?.bio || userInfodemo.bio}
            </Text>

            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <JobBag />
                <Text style={styles.detailText}>
                  {userInfo?.designation || userInfodemo.designation}{" "}
                  <Text style={styles.textBold}>
                    {userInfo?.company_name || userInfodemo.company_name}
                  </Text>
                </Text>
              </View>
              <View style={styles.detailItem}>
                <StudyIcon />
                <Text style={styles.detailText}>
                  Studying at{" "}
                  <Text style={styles.textBold}>
                    {userInfo?.study || userInfodemo.study}
                  </Text>
                </Text>
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
              {["Posts", "Reposts", "Reels"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, activeTab === tab && styles.activeTab]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab && styles.activeTabText,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Content area for posts/reposts/reels */}
          <View style={styles.content}>
            {activeTab === "Posts" && (
              <Posts posts={userInfo?.posts} user={userInfo} />
            )}
            {activeTab === "Reposts" && (
              <Reposts reposts={reposts} user={userInfo} />
            )}
            {activeTab === "Reels" && <Reels reels={reels} />}
          </View>
        </ScrollView>
      )}

      <Profile3dot
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        profileLink="https://yourapp.com/profile/johndoe"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
  },
  scrollView: {
    flex: 1,
  },
  coverImage: {
    width: width,
    height: 200,
    resizeMode: "cover",
  },
  topButtons: {
    position: "absolute",
    top: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
    zIndex: 1,
  },
  iconButton: {
    width: 27,
    height: 27,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileSection: {
    backgroundColor: "#fff",
    marginTop: -30,
    paddingTop: 16,
    paddingHorizontal: 15,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileImage: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 4,
    borderColor: "#fff",
    marginTop: -65,
  },
  joinDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: -30,
  },
  joinDate: {
    color: "#000",
    fontSize: 13,
    fontFamily: "Figtree-Regular",
  },
  userInfo: {
    marginTop: 4,
  },
  nameSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  userName: {
    fontSize: 24,
    fontFamily: "Figtree-Medium",
    lineHeight: 28,
  },
  userHandle: {
    marginTop: 4,
    color: "#666",
    fontSize: 15,
    fontFamily: "Figtree-Regular",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    width: "100%",
  },
  centerStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statGroup: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontFamily: "Figtree-Medium",
    color: "#000",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Figtree-Regular",
  },
  divider: {
    marginHorizontal: 20,
    width: 2,
    height: 40,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  userBio: {
    fontSize: 14,
    fontFamily: "Figtree-Regular",
    color: "#000",
    marginVertical: 10,
    lineHeight: 20,
  },
  detailsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    color: "#000",
    fontFamily: "Figtree-Regular",
    fontSize: 14,
  },
  textBold: {
    fontFamily: "Figtree-Medium",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 1,
    borderBottomColor: "#0063AC",
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Figtree-Regular",
    color: "#666",
  },
  activeTabText: {
    color: "#0063AC",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    minHeight: 500,
  },
  bridgeButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    backgroundColor: "#0063AC",
    alignItems: "center",
    justifyContent: "center",
    height: 24,
  },
  bridgedButton: {
    backgroundColor: "#003B66",
  },
  bridgeButtonText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Figtree-Medium",
    lineHeight: 16,
  },
  bridgedButtonText: {
    color: "#fff",
  },
  messageButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#666",
    marginRight: 8,
    width: 100,
    marginTop: 10,
  },
  messageButtonText: {
    color: "#666",
    fontFamily: "Figtree-Bold",
  },
});

export default HostProfile;
