import React, { useMemo, useState, useEffect } from "react";
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import PostHeader from "./PostHeader";
import ActionButtons from "../buttons/ActionButtons";
import { useNavigation } from "@react-navigation/native";
import RepostButton from "../buttons/RepostButton";
//import ImageColors from "react-native-image-colors";

const { width: WINDOW_WIDTH } = Dimensions.get("screen");
const STORY_LIST_ITEM_WIDTH = WINDOW_WIDTH * 0.71;

const PostMedia = ({
  data,
  handleShare,
  handleComment,
  handleRepost,
  selectedImage,
  onSelectImage,
  isSwiperChild,
}) => {
  const navigation = useNavigation();
  //const [bgColor, setBgColor] = useState("#CEEAFF"); // Default background color
  const bgColor = "#CEEAFF";
  
  const displayedImages = useMemo(
    () => data?.images?.slice(0, 3) || [],
    [data?.images]
  );

  // useEffect(() => {
  //   if (selectedImage?.image) {
  //     ImageColors.getColors(selectedImage.image, {
  //       cache: true,
  //       fallback: "#CEEAFF",
  //     }).then((colors) => {
  //       if (colors.platform === "android") {
  //         setBgColor(colors.lightVibrant || "#CEEAFF");
  //       } else {
  //         setBgColor(colors.background || "#CEEAFF");
  //       }
  //     });
  //   }
  // }, [selectedImage]);

  return (
    <View style={{ flexDirection: "column", alignItems: "center" }}>
      <View
        style={[
          { width: STORY_LIST_ITEM_WIDTH },
          !isSwiperChild && styles.container,
        ]}
      >
        {/* post header */}
        <PostHeader
          user={data?.user}
          post={data}
          postId={data?.id}
          bgColor={bgColor}
        />
        {/* post Image */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            navigation.navigate("PostDetails", { post: { ...data } })
          }
        >
          <Image style={[styles.singleImage]} source={selectedImage?.image} />
        </TouchableOpacity>

        {/* Post Overview Options */}
        <View style={styles.overview}>
          {data?.images?.length > 1 && (
            <View style={styles.indicatorsContainer}>
              {displayedImages.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    onSelectImage(item);
                  }}
                >
                  <Image
                    source={item.image}
                    style={[
                      styles.indicatorImage,
                      item.id === selectedImage.id && styles.isSelected,
                    ]}
                  />
                </Pressable>
              ))}
            </View>
          )}
          {!data.is_repost && (
            <View style={{ position: "absolute", right: 5, bottom: 5 }}>
              <RepostButton handlePress={() => handleRepost(data)} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default React.memo(PostMedia);

const styles = StyleSheet.create({
  container: {
    width: STORY_LIST_ITEM_WIDTH,
  },
  singleImage: {
    width: "100%",
    borderRadius: 15,
    aspectRatio: 1 / 1,
    backgroundColor: "#c8c8c8",
  },
  isSelected: { borderWidth: 1.5, borderColor: "#97D3FF" },
  overview: {
    left: 10,
    right: 10,
    bottom: 10,
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  indicatorsContainer: {
    gap: 5,
    alignItems: "center",
    flexDirection: "row",
  },
  indicatorImage: {
    width: 25,
    height: 25,
    borderRadius: 5,
    backgroundColor: "gray",
  },
});
