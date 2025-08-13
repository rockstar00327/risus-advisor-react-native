import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import HeartIcon from "../../../components/buttons/FeedIcons/Post_Icons/HeartIcon";
import HeartSelected from "../../../components/buttons/FeedIcons/Post_Icons/HeartSelected";
import { BASE_URL } from "../../../constant/BaseConst";
import { useNavigation } from "@react-navigation/native";
import DummyProfile from "../../../assets/DummyImage/DummyProfile.png";
import { formatDate } from "../../../func/basicFunc";

const RepostCard = ({ item, onSelect }) => {
  const navigation = useNavigation();
  const defaultUserImg = "https://randomuser.me/api/portraits/women/40.jpg";
  const [liked, setLiked] = useState(item.is_liked);
  const [likesCount, setLikesCount] = useState(item.total_likes);

  const handlePostPress = () => {
    // navigation.navigate("PostDetails", { post: { ...item } });
    onSelect(item);
  };

  const handleLike = async () => {
    const previousState = { liked, likesCount };

    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));

    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.post(
        `${BASE_URL}/api/posts/${item.id}/like-post/`,
        null,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (response.data?.message === "Liked") {
        setLiked(true);
      } else if (response.data?.message?.toLowerCase() === "unliked") {
        setLiked(false);
      }
    } catch (error) {
      console.error("Error updating like:", error.message);
      setLiked(previousState.liked);
      setLikesCount(previousState.likesCount);
    }
  };

  //console.log(item);

  return (
    <Pressable style={styles.repostCard} onPress={handlePostPress}>
      <View style={styles.userInfo}>
        <Image
          source={{
            uri:
              typeof item?.user?.image === "string"
                ? item.user.image
                : DummyProfile,
          }}
          style={styles.avatar}
          contentFit="cover"
        />
        <View>
          <Text style={styles.name} numberOfLines={1}>
            {item.user.display_name}
          </Text>
          <Text style={styles.username} numberOfLines={1}>
            @{item.user.username} - {formatDate(item.date_created)}
          </Text>
        </View>
      </View>
      {/* content */}
      <Text style={styles.title} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={[styles.content, { marginBottom: 10 }]} numberOfLines={1}>
        {item.content}
      </Text>
      {/* main image */}
      <Image
        source={{
          uri:
            typeof item?.images?.[0]?.image === "string"
              ? item.images[0].image
              : DummyProfile,
        }}
        style={styles.mainImage}
        contentFit="cover"
      />

      {/* <View style={styles.contentContainer}>
        <Pressable style={styles.likeContainer} onPress={handleLike}>
          {liked ? <HeartSelected /> : <HeartIcon />}
          <Text style={[styles.likeCount, liked && styles.likedText]}>
            {likesCount >= 1000
              ? (likesCount / 1000).toFixed(likesCount % 1000 === 0 ? 0 : 1) +
                "K"
              : likesCount}
          </Text>
        </Pressable>
      </View> */}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  repostCard: {
    // width: Dimensions.get("window").width * 0.83,
    width: 303,
    height: 275,
    marginHorizontal: 15,
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    padding: 15,
    shadowColor: "#333",
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 30,
    zIndex: 1,
    alignSelf: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    // position: "absolute",
    //top: 0,
    //left: 0,
    //zIndex: 1,
    //backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderTopLeftRadius: 16,
    paddingRight: 10,
    maxWidth: "90%",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 20,
    marginRight: 7,
  },
  name: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  username: {
    color: "#acacad",
    fontSize: 12,
    fontWeight: "400",
  },
  mainImage: {
    width: "100%",
    height: 137,
    backgroundColor: "#E1E8ED",
    borderRadius: 12,
  },
  contentContainer: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#14171A",
    marginBottom: 4,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCount: {
    fontSize: 14,
    color: "#657786",
    marginLeft: 4,
  },
  likedText: {
    color: "#1DA1F2",
    fontSize: 14,
  },
});

export default React.memo(RepostCard);
