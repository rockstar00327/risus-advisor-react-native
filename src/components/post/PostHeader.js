import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import { useNavigation, CommonActions } from "@react-navigation/native";

import {
  Text,
  View,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Post3dots from "./Post3Dots";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../constant/BaseConst";
import Toast from "../Toast/Toast";
const PostHeader = ({ user, postId, post, bgColor }) => {
  const navigation = useNavigation();

  const [menuVisible, setMenuVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const getCurrentUser = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return null;
      const { data } = await axios.get(`${BASE_URL}/api/user/profile/`, {
        headers: { Authorization: `Token ${token}` },
      });
      // console.log(data.image);
      setCurrentUser(data);
      return data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const isOwnPost = user.user_id === currentUser?.id;
  // console.log(isOwnPost);
  //console.log(user);

  const handleProfilePress = () => {
    if (user) {
      navigation.dispatch(
        CommonActions.navigate({
          name: "HostProfile",
          params: { user },
        })
      );
    }
  };

  const handleDeletePost = (id) => {
    console.log("Deleting post:", id);
  };

  const handleEditPost = (id) => {
    console.log("Editing post:", id);
  };

  const handleSharePost = (id) => {
    console.log("Sharing post:", id);
  };

  const handleReportPost = async (postId) => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/posts/${postId}/report/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      console.log(response.data);

      if (response.status === 200) {
        console.log("Profile reported:", postId);
        showToast(`You reported the post Id: ${response.data.post}`);

        // setAlertConfig({
        //   visible: true,
        //   type: "success",
        //   message: `You reported the post Id: ${response.data.post}`,
        // });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      // showToast("Error generating report");
    }
    console.log("Reporting post:", postId);
  };

  const handleBookMark = async (postId) => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/post-bookmarks/`,
        { post: postId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      // console.log(response.status);

      if (response.status === 201) {
        console.log("Post Bookmarked:", postId);
        showToast(`Bookmarked post Id: ${response.data.post}`);

        if (response.status === 200) {
          console.log("Post unBookmarked:", postId);
          showToast(`${response.data.message}: ${postId}`);
        }
      }
    } catch (error) {
      console.error("Error generating bookmark:", error);
      showToast("Already bookmarked!");
    }
    // console.log("Bookmarked post:", postId);
  };

  return (
    <>
      <BlurView
        tint="light"
        intensity={40}
        experimentalBlurMethod="dimezisBlurView"
        style={[styles.container, { backgroundColor: bgColor }]}
      >
        <TouchableOpacity onPress={handleProfilePress}>
          <View style={styles.row}>
            <Image style={styles.userImage} source={{ uri: user?.image }} />
            <TouchableOpacity
              style={styles.column}
              onPress={handleProfilePress}
            >
              <Text style={styles.name}>{user?.display_name}</Text>
              <Text style={styles.tag}>@{user?.username}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
          activeOpacity={0.7}
        >
          <MaterialIcons name="more-vert" size={24} color="black" />
        </TouchableOpacity>
      </BlurView>

      <Post3dots
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        postId={postId}
        postData={post}
        isOwnPost={isOwnPost}
        onDelete={handleDeletePost}
        onEdit={handleEditPost}
        onShare={handleSharePost}
        onReport={handleReportPost}
        showToast={showToast}
        handleBookMark={handleBookMark}
      />
      <Toast
        visible={toastVisible}
        message={toastMessage}
        onDismiss={() => setToastVisible(false)}
      />
    </>
  );
};

export default React.memo(PostHeader);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99,
    paddingLeft: 10,
    paddingBlock: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
  },
  row: {
    gap: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  column: { gap: 2 },
  name: {
    color: "rgba(0, 0, 0, 1)",
    textTransform: "capitalize",
    fontFamily: "Figtree-Medium",
  },
  tag: {
    fontSize: 13,
    fontFamily: "Figtree-Light",
    color: "rgba(0, 0, 0, 1)",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    borderColor: "#ffffff",
    backgroundColor: "gray",
  },
  menuButton: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
    // zIndex: 100,
  },
});
