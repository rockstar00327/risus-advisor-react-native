import React, { useState, useEffect, useCallback, useMemo } from "react";
import Animated, {
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import PostMedia from "./PostMedia";
import ActionButtons from "../buttons/ActionButtons";
import { StoryListItemHeight } from "./PostListItem";
import ReadMoreText from "../common/ReadMoreText";

const Post = ({
  post,
  handleShare,
  handleRepost,
  handleComment,
  showDetails = true,
  isSwiperChild = false,
  index,
  onUpdatePost,
  setScrollViewHeight,
}) => {
  const { width } = useWindowDimensions(); // Get dynamic screen width
  const [selectedImage, setSelectedImage] = useState(post?.images?.[0] ?? null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [textHeight, setTextHeight] = useState(0);

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(showDetails ? 1 : 0, { duration: 200 }),
    }),
    [showDetails]
  );

  useEffect(() => {
    setScrollViewHeight(
      isExpanded
        ? StoryListItemHeight + textHeight - 20
        : StoryListItemHeight + 0
    );
  }, [isExpanded, textHeight]);

  useEffect(() => {
    if (!showDetails) setIsExpanded(false);
  }, [showDetails]);

  const toggleExpand = useCallback(() => setIsExpanded((prev) => !prev), []);

  const handleTextLayout = useCallback((event) => {
    setTextHeight(event.nativeEvent.layout.height);
  }, []);

  return (
    <View style={[styles.container, isSwiperChild && styles.noMarginTop]}>
      <PostMedia
        data={post}
        handleShare={handleShare}
        handleComment={handleComment}
        selectedImage={selectedImage}
        onSelectImage={setSelectedImage}
        handleRepost={handleRepost}
        isSwiperChild={isSwiperChild}
        showDetails={showDetails}
      />

      <Animated.View
        style={[styles.bodyContainer, animatedStyle, styles.firstSwipeItem]}
      >
        <ActionButtons
          post={post}
          handleShare={handleShare}
          handleComment={handleComment}
          onUpdatePost={onUpdatePost}
        />

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {post?.title}
          </Text>
          {/* <ReadMoreText text={post?.content} /> */}

          <TouchableOpacity onPress={toggleExpand}>
            <View>
              <Text
                style={styles.content}
                onLayout={handleTextLayout}
                numberOfLines={isExpanded ? undefined : 1}
              >
                {!isExpanded ? post?.content?.slice(0, 22) + "" : post?.content}
                {post?.content?.length > 22 && (
                  <Text style={styles.readMore}>
                    {!isExpanded ? "...Read More" : ""}
                  </Text>
                )}
              </Text>
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity onPress={toggleExpand} disabled={textHeight <= 51}>
            <View style={styles.contentWrapper(width)}>
              <Text
                style={styles.content}
                onLayout={handleTextLayout}
                numberOfLines={isExpanded ? undefined : 3}
              >
                {post?.content}
              </Text>
              {!isExpanded && textHeight > 51 && (
                <View style={styles.readMoreContainer}>
                  <Text style={styles.readMoreText}>...Read more</Text>
                </View>
              )}
            </View>
          </TouchableOpacity> */}
          {post.highlighted_comment?.length > 0 && (
            <View style={styles.profileContainer}>
              {post.highlighted_comment[0].user.image ? (
                <Image
                  style={styles.userImage}
                  source={{ uri: post.highlighted_comment[0].user.image }}
                  cachePolicy="memory"
                />
              ) : (
                <Image
                  style={styles.userImage}
                  source={require("../../assets/images/ava3.jpeg")}
                  cachePolicy="memory"
                />
              )}

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.tag}>
                  @{post.highlighted_comment[0].user.username}
                </Text>
                <Text style={styles.description}>
                  {post.highlighted_comment[0].content}
                </Text>
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

export default React.memo(Post);

const styles = StyleSheet.create({
  container: { marginTop: 30 },
  noMarginTop: { marginTop: 0 },
  bodyContainer: {
    gap: 10,
    // paddingBottom: 5,
    // backgroundColor: "rgba(241, 243, 255, 1)",
    marginBottom: 20,
    width: "100%",
  },
  firstSwipeItem: { marginTop: 0 },
  textContainer: { gap: 5, paddingLeft: 15 },
  title: { fontSize: 15, fontFamily: "Figtree-Medium", color: "#000" },
  contentWrapper: (width) => ({
    flexDirection: "row",
    width: width - 65, // Responsive width
  }),
  content: {
    fontSize: 14,
    fontFamily: "Figtree-Regular",
    color: "#000",
    lineHeight: 18,
    flexShrink: 1,
  },
  readMoreContainer: { alignSelf: "flex-end", paddingHorizontal: 5 },
  readMoreText: { fontWeight: "bold" },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 5,
  },
  userImage: {
    width: 20,
    height: 20,
    borderRadius: 40,
    resizeMode: "contain",
    backgroundColor: "gray",
  },
  tag: { fontSize: 13, fontFamily: "Figtree-Light", color: "#000" },
  description: {
    fontSize: 13,
    color: "#000",
    marginLeft: 6,
    fontFamily: "Figtree-Medium",
  },
  readMore: {
    fontFamily: "Figtree-Bold",
  },
});
