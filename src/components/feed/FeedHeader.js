import React, { useCallback } from "react";
import AdVisorLogo from "../buttons/FeedIcons/AdVisorLogo";
import SearchIcon from "../buttons/FeedIcons/SearchIcon";
import BellIcon from "../buttons/FeedIcons/Bellicon";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";

const FEED_OPTIONS = [
  {
    title: "Trending",
    value: "trending",
  },
  {
    title: "My interests",
    value: "interests",
  },
  {
    title: "Explore",
    value: "explore",
  },
];

const FeedHeader = ({ userImage, notifications }) => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = React.useState("trending"); // Default selected tab

  useFocusEffect(
    useCallback(() => {
      return () => {
        // Cleanup on unfocus
      };
    }, [])
  );

  const handleSearchPress = useCallback(() => {
    navigation.navigate("SearchScreen");
  }, [navigation]);

  const handleNotificationPress = useCallback(() => {
    navigation.navigate("NotificationScreen");
  }, [navigation]);

  const handleProfilePress = useCallback(() => {
    navigation.navigate("ProfileScreen");
  }, [navigation]);
  // console.log("notification", notifications);

  return (
    <LinearGradient
      colors={["rgba(125, 201, 255, 0.11)", "rgba(255, 255, 255, 0.3)"]}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        <View style={styles.headerTop}>
          {/* Left - Notification Icon */}
          <TouchableOpacity
            onPress={handleNotificationPress}
            activeOpacity={0.7}
            style={styles.leftIcon}
          >
            <View style={styles.notificationContainer}>
              <BellIcon width={20} height={20} />
              <Text style={styles.badgeText}>{notifications.length}</Text>
            </View>
          </TouchableOpacity>

          {/* Center - Risus Logo */}
          <View style={styles.centerLogo}>
            <Text style={styles.logo}>Risus</Text>
            {/* <AdVisorLogo width={89} height={20} /> */}
          </View>

          {/* Right - Search and Profile Icons */}
          <View style={styles.rightIcons}>
            <TouchableOpacity
              onPress={handleSearchPress}
              activeOpacity={0.7}
              style={styles.iconSpacing}
            >
              <SearchIcon width={24} height={24} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
              <Image
                source={{ uri: userImage }}
                style={styles.profileImage}
                defaultSource={require("../../assets/ProfileScreenImages/Profile.jpg")}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabContainer}>
          {FEED_OPTIONS.map((tab) => (
            <Pressable
              key={tab.value}
              onPress={() => setSelectedTab(tab.value)}
              style={[
                styles.tabButton,
                selectedTab === tab.value && styles.activeTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab.value && styles.activeTabText,
                ]}
              >
                {tab.title}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    width: "100%",
  },
  container: {
    paddingTop: 12,
    paddingHorizontal: 16, //as per the seeyam bhai's design
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  leftIcon: {
    flex: 1,
    alignItems: "flex-start",
  },
  centerLogo: {
    flex: 2,
    alignItems: "center",
  },
  logo: {
    fontFamily: "Briem-Medium",
    fontSize: 28,
    color: "#7DC8FF",
    letterSpacing: 0.8,
  },
  rightIcons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  iconSpacing: {
    marginRight: 16,
  },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    width: "65%",
    height: 30,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#000000",
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
  },
  badgeText: {
    marginLeft: 4,
    color: "#000",
    fontSize: 16,
    fontFamily: "Figtree-Bold",
    textAlign: "center",
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E5E5",
  },
  tabContainer: {
    flexDirection: "row",
    gap: 24,
    marginTop: 4,
  },
  tabButton: {
    paddingVertical: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#0063AC",
  },
  tabText: {
    fontSize: 15,
    fontFamily: "Figtree-Regular",
    color: "#00000080",
  },
  activeTabText: {
    color: "#0063AC",
    fontFamily: "Figtree-Medium",
  },
});

export default React.memo(FeedHeader);
