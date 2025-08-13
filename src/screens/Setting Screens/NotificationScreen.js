import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../constant/BaseConst";
import { formatDate } from "../../func/basicFunc";
import { useNavigation } from "@react-navigation/native";

const NotificationScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Special Offer!",
      description:
        "Get 50% off on premium features this week only! Don't miss out on this limited time offer.",
      time: "Just now",
      read: false,
      type: "offer",
      expanded: false,
    },
    {
      id: 2,
      title: "Suhaib Commented on your Contribution",
      description: "18 people commented on your contribution",
      time: "25m ago",
      read: false,
      type: "comment",
      expanded: false,
    },
    {
      id: 3,
      title: "Payment Successful",
      description:
        "Your payment of $50 has been processed. Transaction ID: #123456. Thank you for your purchase!",
      time: "30m ago",
      read: true,
      type: "payment",
      expanded: false,
    },
    {
      id: 4,
      title: "New Repost from Sarah",
      description:
        "Hey! I've reviewed your latest project submission. The results are impressive...",
      time: "1h ago",
      read: false,
      type: "message",
      expanded: false,
    },
    {
      id: 5,
      title: "Suhaib Reacted to your Contribution",
      description: "178 people reacted to your contribution",
      time: "2h ago",
      read: true,
      type: "reactions",
      expanded: false,
    },
    {
      id: 6,
      title: "Security Alert",
      description:
        "New login detected from London, UK. If this wasn't you, please secure your account immediately.",
      time: "2h ago",
      read: false,
      type: "security",
      expanded: false,
    },
    {
      id: 7,
      title: "Achievement Unlocked!",
      description:
        "Congratulations! You've completed 100 Reposts campaign. Keep up the great work!",
      time: "3h ago",
      read: true,
      type: "achievement",
      expanded: false,
    },
  ]);
  const [allnot, setAllNot] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await fetch(`${BASE_URL}/api/notifications/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setAllNot(result.results);
        setLoading(false);
      }
      // console.log(result.results);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "message":
        return "git-compare-outline";
      case "comment":
        return "chatbubbles-outline";
      case "payment":
        return "card";
      case "security":
        return "shield-checkmark";
      case "offer":
        return "gift";
      case "achievement":
        return "trophy";
      case "reactions":
        return "heart";
      case "wlc":
        return "balloon-sharp";
      default:
        return "notifications";
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case "message":
        return "#007AFF";
      case "comment":
        return "#007AFF";
      case "payment":
        return "#4CD964";
      case "security":
        return "#FF3B30";
      case "offer":
        return "#FF9500";
      case "achievement":
        return "#5856D6";
      case "reactions":
        return "#FF3B30";
      case "wlc":
        return "#ff5ca0";
      default:
        return "#bfdeff";
    }
  };

  const toggleExpand = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id
          ? { ...notif, expanded: !notif.expanded, read: true }
          : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };
  console.log(allnot);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={clearAllNotifications}>
          <Text style={styles.clearAll}>Clear all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.notificationList}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loader}
          />
        ) : allnot.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off" size={50} color="#999" />
            <Text style={styles.emptyStateText}>No notifications</Text>
          </View>
        ) : (
          allnot.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                !notification.read && styles.unread,
              ]}
              onPress={() => toggleExpand(notification.id)}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${getIconColor(notification.type)}15` },
                ]}
              >
                <Ionicons
                  name={getIcon(notification.type)}
                  size={24}
                  color={getIconColor(notification.type)}
                />
              </View>
              <View style={styles.contentContainer}>
                <Text style={styles.notificationTitle}>
                  {notification.title}
                </Text>
                <Text
                  style={[
                    styles.description,
                    notification.expanded && styles.expandedDescription,
                  ]}
                >
                  {notification.description}
                </Text>
                <Text style={styles.time}>
                  {formatDate(notification.date_created)}
                </Text>
              </View>
              {!notification.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "white",
    // borderBottomWidth: 1,
    // borderBottomColor: '#EEEEEE',
    // elevation: 4,
    fontFamily: "Figtree-Bold",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },

    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: "Figtree-Bold",
    flex: 1,
    textAlign: "center",
  },
  clearAll: {
    color: "#007AFF",
    fontSize: 16,
    fontFamily: "Figtree-Regular",
  },
  notificationList: {
    flex: 1,
  },

  notificationItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    // borderBottomWidth: 1,
    // borderBottomColor: '#EEEEEE',
    position: "relative",
  },
  unread: {
    backgroundColor: "rgba(228, 242, 255, 0.5)",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: "Figtree-Bold",
    marginBottom: 4,
    color: "#1A1A1A",
  },

  description: {
    fontSize: 14,
    fontFamily: "Figtree-Regular",
    color: "#666666",
    marginBottom: 4,
    lineHeight: 20,
    numberOfLines: 2,
  },

  expandedDescription: {
    numberOfLines: null,
  },
  time: {
    fontSize: 12,
    color: "#999999",
    fontFamily: "Figtree-Regular",
  },

  unreadDot: {
    position: "absolute",
    right: 16,
    top: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(143, 201, 255, 0.8)",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
    fontFamily: "Figtree-Regular",
  },
});

export default NotificationScreen;
