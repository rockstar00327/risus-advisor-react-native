import React, { useState, useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import * as Font from "expo-font";
import {
  Ionicons,
  FontAwesome5,
  MaterialIcons,
  Feather,
  FontAwesome,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import CommentModal from "./src/components/CommentModal/CommentModalScreen";
import ShareModalScreen from "./src/components/ShareModal/ShareModalScreen";
import BookMarkScreen from "./src/screens/Setting Screens/BookMarkScreen";
import NumFollowerScreen from "./src/components/NumOfFollowers/NumFollowerScreen";

//  screens
// Auth Screens
import WelcomeScreen from "./src/screens/auth/WelcomeScreen";
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/auth/ForgotPasswordScreen";

// Main Screens
import HomeScreen from "./src/screens/main/HomeScreen";
import ReelsScreen from "./src/screens/main/ReelsScreen";
import InboxScreen from "./src/screens/main/InboxScreen";
import SearchScreen from "./src/screens/main/SearchScreen";
import SettingsScreen from "./src/screens/Setting Screens/Settings";

import CreateScreen from "./src/screens/main/CreatePost/CreateScreen";
import PostPreview from "./src/screens/main/CreatePost/PostPreview.js";

import PostDetails from "./src/components/post/Built by Tafsir/PostDetails.js";
import ImageFullView from "./src/components/post/Built by Tafsir/ImageFullView.js";

import ProfileScreen from "./src/screens/main/ProfileScreen/ProfileScreen.js";

import EditProfile from "./src/screens/Setting Screens/Edit_Profile/EditProfile";
import ChangePassword from "./src/screens/Setting Screens/ChangePassword";
import AccountSet from "./src/screens/Setting Screens/AccountSet";
import NotificationScreen from "./src/screens/Setting Screens/NotificationScreen";
import AnalyticsScreen from "./src/screens/Setting Screens/AnalyticsScreen";
import FAQScreen from "./src/screens/Setting Screens/FAQScreen";
import TermsScreen from "./src/screens/Setting Screens/TermsScreen";
import AboutAppScreen from "./src/screens/Setting Screens/AboutAppScreen";
import TokenScreen from "./src/screens/Setting Screens/TokenScreen";

import HostProfile from "./src/screens/main/HostProfile/HostProfile";
import ConversationScreen from "./src/screens/main/Chat/ConversationScreen.js";
import CreateReel from "./src/screens/main/reels/CreateReel.js";
import PublishReels from "./src/screens/main/reels/PublishReels.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import checkMail from "./src/screens/auth/checkMail";
import Interest from "./src/screens/main/ForTheFirstTime/Interest";
import UseAIStep1 from "./src/screens/main/RepostCreation/useAIstep1.js";
import UseAIStep2 from "./src/screens/main/RepostCreation/useAIstep2.js";
import UseAIFinalStep from "./src/screens/main/RepostCreation/useAIFinalStep.js";
import UploadGallery from "./src/screens/main/RepostCreation/uploadGallery.js";
import GalleryStep2 from "./src/screens/main/RepostCreation/gallaryStep2.js";
import Post3dots from "./src/screens/main/ProfileScreen/Post3dots.js";
import { GestureHandlerRootView } from "react-native-gesture-handler";
//import  ReanimatedScreenProvider  from "react-native-screens";
import "react-native-gesture-handler";
import ReelCommentModalScreen from "./src/components/CommentModal/ReelCommentModal.js";
import FAB from "./src/components/buttons/FAB.js";
import { StatusBar } from "expo-status-bar";
import ReelFullView from "./src/screens/main/ProfileScreen/ReelFullView";
import ReelsFullView from "./src/screens/main/HostProfile/ReelsFullView";
import TopUpScreen from "./src/screens/Setting Screens/TokenStacks/TopUpScreen";
import WithdrawScreen from "./src/screens/Setting Screens/TokenStacks/WithdrawScreen";
import GridLayoutScreen from "./src/screens/main/FeedPost/GridLayout.js";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [hasCompletedInterests, setHasCompletedInterests] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Figtree-Regular": require("./src/assets/fonts/Figtree-Regular.ttf"),
        "Figtree-Bold": require("./src/assets/fonts/Figtree-Bold.ttf"),
        "Figtree-Light": require("./src/assets/fonts/Figtree-Light.ttf"),
        "Figtree-Medium": require("./src/assets/fonts/Figtree-Medium.ttf"),
        "Figtree-ExtraBold": require("./src/assets/fonts/Figtree-ExtraBold.ttf"),
        "Figtree-Black": require("./src/assets/fonts/Figtree-Black.ttf"),
        "Briem-Medium": require("./src/assets/fonts/BriemHand-Medium.ttf"),
        "Briem-ExtraBold": require("./src/assets/fonts/BriemHand-ExtraBold.ttf"),
        "Briem-Black": require("./src/assets/fonts/BriemHand-Black.ttf"),
        "Briem-Bold": require("./src/assets/fonts/BriemHand-Bold.ttf"),
        "Briem-Regular": require("./src/assets/fonts/BriemHand-Regular.ttf"),
        "Fugaz-Book": require("./src/assets/fonts/Fugaz-Bold.ttf"),
      });
      setFontsLoaded(true);
      // console.log('fontsLoaded', fontsLoaded);
    }

    async function checkFirstLaunch() {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          // First time launching
          await AsyncStorage.setItem("hasLaunched", "true");
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error("Error checking first launch:", error);
        setIsFirstLaunch(false);
      }
    }

    loadFonts();
    checkFirstLaunch();
  }, []);

  useEffect(() => {
    const checkAuthAndInterests = async () => {
      try {
        setIsLoading(true);
        const authToken = await AsyncStorage.getItem("authToken");
        const interestsCompleted = await AsyncStorage.getItem(
          "hasCompletedInterests"
        );

        console.log("Auth Token:", authToken); // Debug log
        console.log("Interests not Completed:", interestsCompleted); // Debug log

        if (authToken) {
          // await AsyncStorage.removeItem("authToken");
          setIsAuthenticated(true);
          // Only set interests as completed if explicitly 'true'
          setHasCompletedInterests(interestsCompleted === "true");
        } else {
          // Clear everything if not authenticated
          await AsyncStorage.multiRemove([
            "authToken",
            "hasLaunched",
            "email",
            "rememberMe",
            "hasCompletedInterests",
          ]);
          setIsAuthenticated(false);
          setHasCompletedInterests(false);
        }
      } catch (error) {
        console.error("Error checking status:", error);
        setIsAuthenticated(false);
        setHasCompletedInterests(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndInterests();
  }, [isAuthenticated]);

  if (!fontsLoaded || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#87CEEB" />
      </View>
    );
  }
  //console.log(hasCompletedInterests);

  function AuthStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen
          name="Login"
          options={{ animation: "slide_from_left" }} // Slide from left
        >
          {(props) => (
            <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="Register"
          options={{ animation: "slide_from_right" }} // Slide from left
        >
          {(props) => (
            <RegisterScreen
              {...props}
              setIsAuthenticated={setIsAuthenticated}
            />
          )}
        </Stack.Screen>
        {/* <Stack.Screen
          name="Register"
          options={{ animation: "slide_from_right" }}
          component={RegisterScreen}
        /> */}

        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="checkMail" component={checkMail} />
      </Stack.Navigator>
    );
  }

  function MainTabs({ navigation }) {
    const [isTabBarVisible, setIsTabBarVisible] = useState(false);
    const tabBarAnimation = useRef(new Animated.Value(0)).current;

    const toggleTabBar = () => {
      setIsTabBarOpen(!isTabBarOpen);
      Animated.spring(tabBarAnimation, {
        toValue: isTabBarOpen ? 0 : 1,
        duration: 550,
        useNativeDriver: true,
        stiffness: 100,
        damping: 10,
        mass: 1,
        useNativeDriver: true,
      }).start(() => setIsTabBarOpen(!isTabBarOpen));
    };

    const tabBarTranslateX = tabBarAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 10], // Start from A button (20) to final position (70)
    });

    const tabBarScale = tabBarAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1], // Start small and grow
    });

    const tabBarOpacity = tabBarAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.8, 1],
    });

    const [isTabBarOpen, setIsTabBarOpen] = useState(false);

    return (
      <Pressable
        style={{ flex: 1 }}
        onPress={() => isTabBarOpen && toggleTabBar()} // Close tab on outside touch
      >
        <>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: "#58AFFF",
              tabBarInactiveTintColor: "#A4A4A4",
              tabBarButton: (props) => (
                <Pressable
                  {...props}
                  android_ripple={{ color: "transparent" }}
                />
              ),
              tabBarStyle: [
                styles.tabBar,
                {
                  transform: [
                    { translateX: tabBarTranslateX },
                    { scale: tabBarScale },
                  ],
                  opacity: tabBarOpacity,
                  transformOrigin: "left",
                },
              ],
              tabBarItemStyle: styles.tabBarItem,
              tabBarIconStyle: styles.tabBarIcon,
              tabBarShowLabel: false,
              tabBarPressColor: "transparent",
              tabBarPressOpacity: 1,
            }}
          >
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                tabBarIcon: ({ focused }) => (
                  <View
                    style={[
                      styles.iconContainer,
                      focused && styles.activeIconContainer,
                    ]}
                  >
                    {focused ? (
                      <LinearGradient
                        colors={["#000", "#000"]}
                        style={[styles.gradientBg, { opacity: 0.9 }]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Animated.View
                          style={{
                            transform: [
                              {
                                scale: focused
                                  ? new Animated.Value(1.1)
                                  : new Animated.Value(1),
                              },
                            ],
                          }}
                        >
                          <FontAwesome5 name="home" size={20} color="#fff" />
                        </Animated.View>
                      </LinearGradient>
                    ) : (
                      <FontAwesome5 name="home" size={20} color="#808080" />
                    )}
                  </View>
                ),
              }}
            />

            <Tab.Screen
              name="Reels"
              component={ReelsScreen}
              options={{
                tabBarIcon: ({ focused }) => (
                  <View
                    style={[
                      styles.iconContainer,
                      focused && styles.activeIconContainer,
                    ]}
                  >
                    {focused ? (
                      <LinearGradient
                        colors={["#000", "#000"]}
                        style={[styles.gradientBg, { opacity: 0.9 }]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Animated.View
                          style={{
                            transform: [
                              {
                                scale: focused
                                  ? new Animated.Value(1.1)
                                  : new Animated.Value(1),
                              },
                            ],
                          }}
                        >
                          <MaterialIcons
                            name="video-collection"
                            size={20}
                            color="#fff"
                          />
                        </Animated.View>
                      </LinearGradient>
                    ) : (
                      <MaterialIcons
                        name="video-collection"
                        size={20}
                        color="#808080"
                      />
                    )}
                  </View>
                ),
              }}
            />

            <Tab.Screen
              name="Inbox"
              component={InboxScreen}
              options={{
                tabBarIcon: ({ focused }) => (
                  <View
                    style={[
                      styles.iconContainer,
                      focused && styles.activeIconContainer,
                    ]}
                  >
                    {focused ? (
                      <LinearGradient
                        colors={["#000", "#000"]}
                        style={[styles.gradientBg, { opacity: 0.9 }]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Animated.View
                          style={{
                            transform: [
                              {
                                scale: focused
                                  ? new Animated.Value(1.1)
                                  : new Animated.Value(1),
                              },
                            ],
                          }}
                        >
                          <Ionicons name="chatbubbles" size={20} color="#fff" />
                        </Animated.View>
                      </LinearGradient>
                    ) : (
                      <Ionicons name="chatbubbles" size={20} color="#808080" />
                    )}
                  </View>
                ),
              }}
            />
            <Tab.Screen
              name="Create"
              component={CreateScreen}
              options={{
                tabBarIcon: ({ focused }) => (
                  <View
                    style={[
                      styles.iconContainer,
                      focused && styles.activeIconContainer,
                    ]}
                  >
                    {focused ? (
                      <LinearGradient
                        colors={["#000", "#000"]}
                        style={[styles.gradientBg, { opacity: 0.9 }]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Animated.View
                          style={{
                            transform: [
                              {
                                scale: focused
                                  ? new Animated.Value(1.1)
                                  : new Animated.Value(1),
                              },
                            ],
                          }}
                        >
                          <Ionicons name="create" size={20} color="#fff" />
                        </Animated.View>
                      </LinearGradient>
                    ) : (
                      <Ionicons name="create" size={20} color="#808080" />
                    )}
                  </View>
                ),
              }}
            />
            <Tab.Screen
              name="Settings"
              options={{
                tabBarIcon: ({ focused }) => (
                  <View
                    style={[
                      styles.iconContainer,
                      focused && styles.activeIconContainer,
                    ]}
                  >
                    {focused ? (
                      <LinearGradient
                        colors={["#000", "#000"]}
                        style={[styles.gradientBg, { opacity: 0.9 }]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Animated.View
                          style={{
                            transform: [
                              {
                                scale: focused
                                  ? new Animated.Value(1.1)
                                  : new Animated.Value(1),
                              },
                            ],
                          }}
                        >
                          <Ionicons name="settings" size={20} color="#fff" />
                        </Animated.View>
                      </LinearGradient>
                    ) : (
                      <Ionicons name="settings" size={20} color="#808080" />
                    )}
                  </View>
                ),
              }}
            >
              {(props) => (
                <SettingsScreen
                  {...props}
                  setIsAuthenticated={setIsAuthenticated}
                />
              )}
            </Tab.Screen>
          </Tab.Navigator>

          {/* Floating Action Button */}
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={toggleTabBar}
          >
            <Animated.View
              style={[
                styles.buttonContainer,
                {
                  transform: [
                    {
                      rotate: tabBarAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "0deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              <FAB />
            </Animated.View>
          </TouchableOpacity>
        </>
      </Pressable>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor="#BAE2FF33" />

      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <Stack.Screen
              name="AuthStack"
              component={AuthStack}
              options={{
                animation: "slide_from_bottom",
              }}
            />
          ) : (
            <>
              {hasCompletedInterests && (
                <Stack.Screen
                  name="Interest"
                  options={{
                    headerShown: false,
                    animation: "slide_from_right",
                  }}
                >
                  {(props) => (
                    <Interest
                      {...props}
                      setHasCompletedInterests={setHasCompletedInterests}
                    />
                  )}
                </Stack.Screen>
              )}
              <Stack.Screen
                name="MainTabs"
                component={MainTabs}
                options={{
                  animationEnabled: true,
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                options={{ animation: "fade_from_bottom" }}
                name="GridLayout"
                component={GridLayoutScreen}
              />
              <Stack.Screen
                name="createreel"
                component={CreateReel}
                options={{ animation: "slide_from_right" }}
              />
              <Stack.Screen
                name="publishreel"
                component={PublishReels}
                options={{ animation: "slide_from_right" }}
              />
              <Stack.Screen
                options={{ animation: "slide_from_right" }}
                name="HostProfile"
                component={HostProfile}
              />
              <Stack.Screen
                name="PostDetails"
                component={PostDetails}
                options={{
                  animation: "slide_from_right",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="conversation"
                component={ConversationScreen}
                options={{ animation: "slide_from_right" }}
              />
              <Stack.Screen name="PostPreview" component={PostPreview} />
              <Stack.Screen
                options={{ animation: "fade_from_bottom" }}
                name="ProfileScreen"
                component={ProfileScreen}
              />
              <Stack.Screen
                options={{ animation: "slide_from_right" }}
                name="EditProfile"
                component={EditProfile}
              />
              <Stack.Screen
                options={{ animation: "slide_from_right" }}
                name="ChangePassword"
                component={ChangePassword}
              />
              <Stack.Screen
                options={{ animation: "slide_from_right" }}
                name="AccountSet"
                component={AccountSet}
              />
              <Stack.Screen
                options={{ animation: "slide_from_right" }}
                name="NotificationScreen"
                component={NotificationScreen}
              />
              <Stack.Screen
                options={{ animation: "slide_from_right" }}
                name="AnalyticsScreen"
                component={AnalyticsScreen}
              />
              <Stack.Screen
                options={{ animation: "slide_from_right" }}
                name="FAQScreen"
                component={FAQScreen}
              />
              <Stack.Screen
                options={{ animation: "slide_from_right" }}
                name="TermsScreen"
                component={TermsScreen}
              />
              <Stack.Screen
                options={{ animation: "slide_from_right" }}
                name="AboutAppScreen"
                component={AboutAppScreen}
              />
              <Stack.Screen
                name="ImageFullView"
                component={ImageFullView}
                options={{
                  headerShown: false,
                  presentation: "modal",
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                name="SearchScreen"
                component={SearchScreen}
                options={{
                  animation: "slide_from_right",
                  presentation: "card",
                }}
              />
              <Stack.Screen
                name="RepostCreation"
                component={UseAIStep1}
                options={{ animation: "slide_from_right", headerShown: false }}
              />
              <Stack.Screen
                name="UseAIStep2"
                component={UseAIStep2}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="UseAIFinalStep"
                component={UseAIFinalStep}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="UploadGallery"
                component={UploadGallery}
                options={{ animation: "slide_from_right", headerShown: false }}
              />
              <Stack.Screen
                name="GalleryStep2"
                component={GalleryStep2}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="CommentModal"
                component={CommentModal}
                options={{
                  presentation: "modal",
                  animation: "slide_from_bottom",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ReelCommentModal"
                component={ReelCommentModalScreen}
                options={{
                  presentation: "modal",
                  animation: "slide_from_bottom",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ShareModal"
                component={ShareModalScreen}
                options={{
                  presentation: "modal",
                  animation: "slide_from_bottom",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="BookMark"
                component={BookMarkScreen}
                options={{ animation: "slide_from_right" }}
              />
              <Stack.Screen
                name="NumFollowerScreen"
                component={NumFollowerScreen}
                options={{
                  animation: "slide_from_right",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ReelFullView"
                component={ReelFullView}
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                name="ReelsFullView"
                component={ReelsFullView}
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                options={{ animation: "slide_from_right" }}
                name="TokenScreen"
                component={TokenScreen}
              />
              <Stack.Screen
                name="TopUpScreen"
                component={TopUpScreen}
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                }}
              />
              <Stack.Screen
                name="WithdrawScreen"
                component={WithdrawScreen}
                options={{
                  headerShown: false,
                  animation: "slide_from_right",
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    position: "absolute",
    bottom: 18,
    left: 70,
    right: 20,
    marginLeft: 52,
    width: "70%",
    backgroundColor: "#fff",
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "#CEEAFF",
    shadowColor: "#858585",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tabBarItem: {
    padding: 4,
    marginTop: 0,
  },
  iconContainer: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginTop: 5,
  },
  activeIconContainer: {
    width: 45,
    height: 45,
    marginBottom: 5,
    borderRadius: 27.5,
  },
  gradientBg: {
    width: 35,
    height: 35,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarIcon: {
    marginTop: 0,
    size: 10,
  },
  floatingButton: {
    position: "absolute",
    // backgroundColor: "#CEEAFF",
    bottom: 15,
    left: 15,
    width: 57,
    height: 57,
    borderRadius: 30,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: 55,
    height: 55,
    borderRadius: 29.5,
    // backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    // shadowColor: "#97D3FF",
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: 4.65,
    // elevation: 8,
    // borderWidth: 3,
    // borderColor: "rgba(255, 255, 255, 0.3)",
  },
});
