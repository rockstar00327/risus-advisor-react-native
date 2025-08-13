import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Platform,
  StatusBar
} from "react-native";
import { StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
// import Icon from 'react-native-vector-icons/Feather'
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "../../constant/BaseConst";
import { useNavigation } from "@react-navigation/native";

const Settings = ({ setIsAuthenticated }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    username: "",
    image: "",
  });

  const menuItems1 = [
    { icon: "edit-2", title: "Edit my profile", screen: "EditProfile" },
    { icon: "shield", title: "Change Password", screen: "ChangePassword" },
    { icon: "sliders", title: "Account Settings", screen: "AccountSet" },
    { icon: "dollar-sign", title: "Ricoin Balance", screen: "TokenScreen" },
  ];
  const menuItems2 = [
    {
      icon: "bookmark-outline",
      title: "Bookmarks",
      library: "Ionicons",
      screen: "BookMark",
    },
    {
      icon: "bell",
      title: "Notifications",
      library: "Feather",
      screen: "NotificationScreen",
    },
    {
      icon: "analytics-sharp",
      title: "Analytics",
      library: "Ionicons",
      screen: "AnalyticsScreen",
    },
    {
      icon: "help-circle-outline",
      title: "FAQ",
      library: "Ionicons",
      screen: "FAQScreen",
    },
    {
      icon: "document-text-outline",
      title: "Terms & Conditions",
      library: "Ionicons",
      screen: "TermsScreen",
    },
    {
      icon: "information-circle-outline",
      title: "About App",
      library: "Ionicons",
      screen: "AboutAppScreen",
    },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const authToken = await AsyncStorage.getItem("authToken");
        // setIsAuthenticated(authToken);

        if (!authToken) {
          console.log("No auth token found - redirecting to login");
          handleLogout();
          return;
        }

        // Only proceed with the API call if we have a token
        const response = await axios.get(
          `${BASE_URL}/api/user/profile/?q=settings`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );

        setUser({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          username: response.data.username,
          image: response.data.image
            ? { uri: response.data.image }
            : require("../../assets/DummyImage/DummyProfile.png"),
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);

        // Only logout if it's an authentication error (401)
        if (error.response && error.response.status === 401) {
          console.log("Authentication error - logging out");
          handleLogout();
        } else {
          // For other errors, just log them without logging out
          console.error("Non-authentication error:", error.message);
        }
        // If there's an error (like invalid token), log out
        //handleLogout();
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear all stored data on logout
      await AsyncStorage.multiRemove([
        "authToken",
        "hasLaunched",
        "email",
        "rememberMe",
        "hasCompletedInterests",
      ]);

      setIsAuthenticated(false);
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error during logout:", error);
      setIsAuthenticated(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      {/* <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="chevron-left" size={24} color="#000" />
      </TouchableOpacity> */}

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image style={styles.userImage} source={user.image} />
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("ProfileScreen")}
          >
            <Text style={styles.name}>
              {user.first_name} {user.last_name}
            </Text>
            <Text style={styles.username}>@{user.username}</Text>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.accountSection}>
          {/* Icon and Title */}
          <View style={styles.accountHeader}>
            <Feather name="user" size={20} color="black" />
            <Text style={styles.accountTitle}>Account</Text>
          </View>

          {/* Underline */}
          <View style={styles.accountUnderline}></View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems1.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(item.screen)}
              style={styles.menuItem}
            >
              <Feather
                name={item.icon}
                size={20}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.menuText}>{item.title}</Text>
              <Feather
                name="chevron-right"
                size={20}
                color="black"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Others Section */}
        <View style={styles.accountSection}>
          <View style={styles.accountHeader}>
            <Feather name="info" size={20} color="black" />
            <Text style={styles.accountTitle}>Others</Text>
          </View>
          <View style={styles.accountUnderline}></View>
        </View>
        {/* Menu Items 2 */}
        <View style={styles.menuContainer}>
          {menuItems2.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(item.screen)}
              style={styles.menuItem}
            >
              {/* Conditional Rendering for Different Icon Libraries */}
              {item.library === "Feather" && (
                <Feather name={item.icon} size={24} color="black" />
              )}
              {item.library === "MaterialIcons" && (
                <MaterialIcons name={item.icon} size={24} color="black" />
              )}
              {item.library === "Ionicons" && (
                <Ionicons name={item.icon} size={24} color="black" />
              )}

              <Text style={{ fontSize: 16, marginLeft: 10 }}>{item.title}</Text>
              <Feather
                name="chevron-right"
                size={24}
                color="black"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  profileSection: {
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "flex-start", 
    paddingTop : 20,
    marginBottom: 20,
    paddingLeft: 20,
  },
  userImage: {
    width: 90,
    height: 90,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: "gray",
    borderWidth: 3,
    borderColor: "rgba(108, 108, 108, 0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2.84,
    elevation: 10,
  },
  name: {
    fontSize: 18,
    fontFamily: "Figtree-Bold",
    marginBottom: 5,
  },
  username: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Figtree-Regular",
  },
  accountSection: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  accountHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  accountTitle: {
    fontSize: 16,
    fontFamily: "Figtree-Bold",
    marginLeft: 10,
  },
  accountUnderline: {
    height: 1,
    backgroundColor: "#000",
    marginTop: 10,
  },

  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginLeft: 25,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#000",
    marginHorizontal: 20,
    marginTop: 70,
    marginBottom: 100,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Settings;
