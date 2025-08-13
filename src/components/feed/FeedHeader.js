import React, { useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

const FEED_OPTIONS = [
  {
    title: "For you",
    value: "foryou",
    icon: require('../../../assets/images/for_you_icon.png'),
  },
  {
    title: "Explore",
    value: "explore",
    icon: require('../../../assets/images/explore_icon.png'),
  },
  {
    title: "Trending",
    value: "trending",
    icon: require('../../../assets/images/trending_icon.png'),
  },
];

const FeedHeader = ({ userImage, notifications }) => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = React.useState("trending");

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

  return (
    <LinearGradient
      colors={["rgba(125, 201, 255, 0.11)", "rgba(255, 255, 255, 0.3)"]}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        <View style={styles.headerTop}>
          {/* Left - Notification Badge */}
          <TouchableOpacity
            onPress={handleNotificationPress}
            activeOpacity={0.7}
          >
            <View style={styles.notificationBadge}>
              <Image source={require('../../../assets/images/bell.png')} style={styles.notificationImage} />
              <Text style={styles.badgeText}>{notifications?.length || 0}</Text>
            </View>
          </TouchableOpacity>

          {/* Center - Logo */}
          <View style={styles.centerLogo}>
            <Text style={styles.logo}>Risus</Text>
          </View>

          {/* Right - Search and Profile Icons */}
          <View style={styles.rightIcons}>
            <TouchableOpacity
              onPress={handleSearchPress}
              activeOpacity={0.7}
              style={styles.iconSpacing}
            >
              <Image source={require('../../../assets/images/search.png')} style={styles.searchIconImage} />
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
            <TouchableOpacity
              key={tab.value}
              onPress={() => setSelectedTab(tab.value)}
              style={[
                styles.tab,
                selectedTab === tab.value && styles.activeTab,
              ]}
            >
              <Image 
                source={tab.icon} 
                style={[
                  styles.tabIcon,
                  selectedTab === tab.value && styles.activeTabIcon
                ]} 
              />
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab.value && styles.activeTabText,
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
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
  notificationBadge: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    height: 30,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderColor: '#000000',
    borderWidth: 1,
    gap: 4,
    minWidth: 50,
  },
  notificationImage: {
    width: 20,
    height: 20
  },
  badgeText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Figtree-Bold",
    textAlign: "center",
  },
  searchIconImage: {
    width: 24,
    height: 24
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E5E5",
  },
  tabContainer: {
    width: '100%',
    flexDirection: "row",
    marginTop: 4,
  },
  tab: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 10,
    gap: 10,
    width: '30%'
  },
  activeTab: {
    backgroundColor: 'rgba(155, 212, 255, 0.25)', // Changed from hex to rgba for better transparency support
  },
  tabIcon: {
    width: 14,
    height: 14,
    objectFit: 'cover',
    tintColor: '#131313', // Default color for inactive icons
  },
  activeTabIcon: {
    tintColor: '#0167CC', // Active icon color (matches your active text color)
  },
  tabText: {
    fontFamily: 'Figtree_400Regular',
    fontWeight: '600',
    fontStyle: 'normal',
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#131313',
  },
  activeTabText: {
    color: "#0167CC",
    fontWeight: "600",
  },
});

export default React.memo(FeedHeader);