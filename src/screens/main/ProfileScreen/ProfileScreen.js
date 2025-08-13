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
import React, { useEffect, useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import StudyIcon from "../../../components/buttons/UserProfileScreen_Icons/StudyIcon";
import JobBag from "../../../components/buttons/UserProfileScreen_Icons/JobBag";
import CalendarIcon from "../../../components/buttons/UserProfileScreen_Icons/CalendarIcon";
import Edit_icon from "../../../components/buttons/UserProfileScreen_Icons/Edit_Icon";
import Posts from "./Posts";
import { useNavigation } from "@react-navigation/native";
import ProfileInfo3Dots from "./ProfileInfo3Dots";
import Reposts from "./Reposts";
import Reels from "./Reels";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../../constant/BaseConst";
import ThreedotSVG from './SVG/ThreedotSVG';

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Posts");
  const [showOptions, setShowOptions] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [reposts, setReposts] = useState(null);
  const [reels, setReels] = useState(null);
  const [loading, setLoading] = useState(true);
  // Add state to store the 3dots button position
  const [threeDotPosition, setThreeDotPosition] = useState({ x: 0, y: 0 });

  // Add useRef at the top imports
  const threeDotRef = useRef(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  // Function to measure and update position
  const measureThreeDotPosition = () => {
    if (threeDotRef.current) {
      threeDotRef.current.measure((x, y, width, height, pageX, pageY) => {
        setModalPosition({
          x: pageX,
          y: pageY + height
        });
      });
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. First fetch user profile
      const token = await AsyncStorage.getItem("authToken");
      const profileResponse = await fetch(`${BASE_URL}/api/user/profile/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

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
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  if (reposts && reels) {
    // console.log("Reposts:", reposts);
    // console.log("Reels:", reels);
  }

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

          {/* Back and Share buttons */}
          <View style={styles.topButtons}>
            <TouchableOpacity style={styles.iconButton} onPress={handleBack}>
              <Ionicons name="chevron-back-outline" size={21} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              ref={threeDotRef}
              style={styles.iconButton}
              onPress={() => {
                measureThreeDotPosition();
                setShowOptions(true);
              }}
            >
              <ThreedotSVG />
            </TouchableOpacity>
          </View>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileHeader}>
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
              <View style={styles.joinDateContainer}>
                <CalendarIcon />
                <Text style={styles.joinDate}>Since 31 July 2024</Text>
              </View>
            </View>

            <View style={styles.userInfo}>
              <View style={styles.nameSection}>
                <Text style={styles.userName}>
                  {userInfo?.first_name && userInfo?.last_name
                    ? `${userInfo?.first_name} ${userInfo?.last_name}`
                    : "NO NAME"}
                </Text>
                <TouchableOpacity onPress={handleEditProfile}>
                  <Edit_icon />
                </TouchableOpacity>
              </View>
              <Text style={styles.userHandle}>@{userInfo?.username}</Text>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statGroup}>
                <Text style={styles.statNumber}>
                  {userInfo?.posts.length >= 1000
                    ? (userInfo?.posts.length / 1000).toFixed(
                        userInfo?.posts.length % 1000 === 0 ? 0 : 1
                      ) + "K"
                    : userInfo?.posts.length}
                </Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.centerStats}>
                <View style={[styles.statGroup, { marginRight: 15 }]}>
                  <Text style={styles.statNumber}>
                    {userInfo?.ricoins >= 1000
                      ? (userInfo?.ricoins / 1000).toFixed(
                          userInfo?.ricoins % 1000 === 0 ? 0 : 1
                        ) + "K"
                      : userInfo?.ricoins || 0}
                  </Text>
                  <Text style={styles.statLabel}>Ricoins</Text>
                </View>
                <View style={[styles.statGroup, { marginHorizontal: 15 }]}>
                  <Text style={styles.statNumber}>
                    {userInfo?.total_views >= 1000
                      ? (userInfo?.total_views / 1000).toFixed(
                          userInfo?.total_views % 1000 === 0 ? 0 : 1
                        ) + "K"
                      : userInfo?.total_views}
                  </Text>
                  <Text style={styles.statLabel}>Votes</Text>
                </View>
                <View style={[styles.statGroup, { marginLeft: 15 }]}>
                  <Text style={styles.statNumber}>
                    {userInfo?.total_followers >= 1000
                      ? (userInfo?.total_followers / 1000).toFixed(
                          userInfo?.total_followers % 1000 === 0 ? 0 : 1
                        ) + "K"
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
                    ? (userInfo?.total_following / 1000).toFixed(
                        userInfo?.total_following % 1000 === 0 ? 0 : 1
                      ) + "K"
                    : userInfo?.total_following}
                </Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.userBio}>
              {userInfo?.summary ? userInfo?.summary : "No bio"}
            </Text>

            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <JobBag />
                <Text style={styles.detailText}>
                  {userInfo?.designation
                    ? userInfo?.designation
                    : "Senior Adviser at "}{" "}
                  <Text style={styles.textBold}>
                    {" "}
                    {userInfo?.company_name
                      ? userInfo?.company_name
                      : "ABC Company Ltd."}
                  </Text>
                </Text>
              </View>
              <View style={styles.detailItem}>
                <StudyIcon />
                <Text style={styles.detailText}>
                  Studying at{" "}
                  <Text style={styles.textBold}>
                    {userInfo?.study ? userInfo?.study : "University of XYZ"}
                  </Text>
                </Text>
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
              {["Posts", "Reposts", "Reels"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  activeOpacity={1} 
                  style={[
                    styles.tab,
                    activeTab === tab && styles.activeTab
                  ]}
                  onPress={() => {
                    setActiveTab(tab);
                  }}
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

      <ProfileInfo3Dots
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        position={modalPosition}
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
  },
  userName: {
    fontSize: 24,
    fontFamily: "Figtree-Medium",
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
    flex: 1, 
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
    marginHorizontal: -8,
    marginTop: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    alignItems: "center",
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#EBF5FF',
    borderRadius: 10,
    marginHorizontal: 8,
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Figtree-Regular",
    color: "#666",
  },
  activeTabText: {
    color: "#0063AC",
    fontFamily: "Figtree-Medium",
  },
  content: {
    flex: 1,
    backgroundColor: "#ffffff",
    minHeight: 500,
  },
});

export default ProfileScreen;
