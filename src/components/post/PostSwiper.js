import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  ItemSpacing,
  PostListItem,
  StoryListItemWidth,
  StoryListItemHeight,
} from "./PostListItem";
import Post from "./Post";
import Animated, {
  runOnJS,
  useAnimatedRef,
  useAnimatedReaction,
  useScrollViewOffset,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import HookImg from "../../assets/icons/hook.svg";
import RepostIcon from "../../assets/icons/repost-36px.svg";
import Hook from "../buttons/Hook";

const { width } = Dimensions.get("window");

const PostSwiper = ({
  data,
  handleShare,
  handleRepost,
  handleComment,
  onUpdatePost,
  nextPost,
  isEnded,
}) => {
  const animatedRef = useAnimatedRef();
  const scrollOffset = useScrollViewOffset(animatedRef);
  const [activeIndex, setActiveIndex] = useState(0);
  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const isFirstLoad = useRef(true);

  const BorderedContent = ({
    index,
    showDetails = true,
    isSwiperChild = true,
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const animatedStyle = useAnimatedStyle(() => ({
      opacity: withTiming(showDetails ? 1 : 0, { duration: 200 }),
    }));

    useEffect(() => {
      if (!showDetails) {
        setIsExpanded(false);
      }
    }, [showDetails]);
    return (
      <View style={[styles.containerPost, isSwiperChild && styles.noMarginTop]}>
        <TouchableOpacity activeOpacity={1} style={{ marginTop: 30 }}>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <View style={styles.borderedContent}>
              <RepostIcon style={{ width: 36, height: 36 }} />
              <Text style={styles.borderedText}>Tap to repost</Text>
            </View>
          </View>
        </TouchableOpacity>
        {/* post body content */}
        <Animated.View
          style={[
            styles.bodyContainer,
            animatedStyle,
            isSwiperChild && [
              styles.swipeBodyCnt,
              index === 0 && {
                left: -30,
                top: 300,
              }, // Apply left 50 only for first post
            ],
          ]}
        ></Animated.View>
      </View>
    );
  };

  useEffect(() => {
    if (!nextPost && !initialScrollDone && isFirstLoad.current) {
      animatedRef.current.scrollTo({
        x: StoryListItemWidth,
        animated: true,
      });
      setInitialScrollDone(true);
      setActiveIndex(1);
      isFirstLoad.current = false;
    }
  }, []);

  const posts = useMemo(() => {
    if (!data || typeof data !== "object")
      return [<BorderedContent key="bordered-0" index={0} />];

    const { previous_post, next_post, ...updatedPost } = data;
    let postsArray = [];

    if (nextPost) {
      postsArray = [].concat(previous_post || [], updatedPost, next_post || []);
    } else {
      postsArray = []
        .concat(
          previous_post || <BorderedContent key="bordered-0" index={0} />,
          { ...updatedPost, id: updatedPost.id || "updated-post" },
          next_post.length > 0 ? (
            next_post
          ) : (
            <BorderedContent key="bordered-2" index={2} />
          )
        )
        .filter(Boolean);
    }
    //console.log(postsArray[1]);

    return postsArray.length
      ? postsArray
      : [<BorderedContent key="bordered-0" index={0} />];
  }, [data, nextPost]);

  const contentContainerWidth = useMemo(
    () => StoryListItemWidth * posts.length + width - StoryListItemWidth,
    [posts.length]
  );

  const contentContainerStyle = useMemo(
    () => ({ width: contentContainerWidth, marginLeft: 10 }),
    [contentContainerWidth]
  );

  useAnimatedReaction(
    () => scrollOffset.value / StoryListItemWidth,
    (newIndex) => {
      if (posts.length === 0) return; // Prevent crashes

      const roundedIndex = Math.round(newIndex);
      const clampedIndex = Math.max(
        0,
        Math.min(roundedIndex, posts.length - 1)
      );

      if (
        clampedIndex === 0 &&
        posts[clampedIndex]?.id === undefined &&
        isFirstLoad.current
      ) {
        return; // Skip if the first post is a BorderedContent without an ID
      }

      if (!nextPost && !isFirstLoad.current) {
        runOnJS(setActiveIndex)(clampedIndex);
      } else {
        if (activeIndex !== clampedIndex) {
          runOnJS(setActiveIndex)(clampedIndex);
        }
      }
    }
  );

  // Debugging: Log the posts array and activeIndex
  useEffect(() => {
    //console.log("Posts:", posts);
    //console.log("Active Index:", activeIndex);
    //console.log(posts[activeIndex]);
  }, [posts, activeIndex]);
  let height = isEnded ? 20 : 0;
  return (
    <>
      <TouchableOpacity activeOpacity={1}>
        <View
          style={[
            styles.container,
            {
              minHeight: scrollViewHeight + height,
            },
          ]}
        >
          {posts.length > 0 ? (
            <Animated.ScrollView
              ref={animatedRef}
              horizontal
              bounces={false}
              overScrollMode="never"
              disableIntervalMomentum
              decelerationRate="fast"
              snapToInterval={StoryListItemWidth}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16} // 16ms for smooth 60fps scrolling
              contentContainerStyle={contentContainerStyle}
              onContentSizeChange={() => { }}
            >
              {posts.map((post, index) => (
                <PostListItem
                  index={index}
                  scrollOffset={scrollOffset}
                  key={post?.id ? `post-${post.id}` : `bordered-${index}`}
                  style={{ zIndex: index === activeIndex ? 1 : 0 }}
                  post={post}
                  nextPost={nextPost}
                  isEnded={isEnded}
                >
                  {index !== 0 &&
                    index === activeIndex && ( // Hide hookContainer for last post
                      <View style={[styles.hookContainer1]}>
                        <View
                          style={{
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            width: 15,
                            height: 15,
                            marginRight: 10,
                            top: 13,
                            right: 22,
                            zIndex: 1000,
                          }}
                        ></View>

                        <View style={{ zIndex: 1001 }}>
                          <Hook width={width * 0.12} />
                        </View>

                        <View
                          style={{
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            width: 15,
                            height: 15,
                            zIndex: 1000,
                            top: -13,
                            left: 25,
                          }}
                        ></View>
                      </View>
                    )}
                  {post.id ? (
                    <Post
                      post={post}
                      isSwiperChild={true}
                      handleShare={handleShare}
                      handleRepost={handleRepost}
                      handleComment={handleComment}
                      showDetails={activeIndex === index}
                      index={index}
                      onUpdatePost={onUpdatePost}
                      setScrollViewHeight={setScrollViewHeight}
                      nextPost={nextPost}
                    />
                  ) : (
                    post // This ensures BorderedContent gets rendered properly
                  )}

                  {index !== posts.length - 1 &&
                    index === activeIndex && ( // Hide hookContainer for last post
                      <View style={[styles.hookContainer2]}>
                        <View
                          style={{
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            width: 15,
                            height: 15,
                            marginRight: 10,
                            top: 13,
                            right: 20,
                            zIndex: 1000,
                          }}
                        ></View>

                        {/* <HookImg style={{ zIndex: 1001 }} /> */}
                        <View style={{
                          zIndex: 1001,
                          right: 0,

                        }}>
                          <Hook width={width * 0.12} />
                        </View>
                        <View
                          style={{
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            width: 15,
                            height: 15,
                            zIndex: 1000,
                            top: -13,
                            left: 25,
                          }}
                        ></View>
                      </View>
                    )}
                </PostListItem>
              ))}
            </Animated.ScrollView>
          ) : (
            <Text>No posts available</Text>
          )}
        </View>
      </TouchableOpacity>
      {/* Border at the bottom of each post excluding the last one */}
      {!isEnded && (
        <View
          style={{
            height: 1,
            // marginTop: 12,
            marginBottom: 20,
            alignSelf: "center",
            backgroundColor: "#4E4E4E80",
            width: Dimensions.get("screen").width - 65,
          }}
        />
      )}
    </>
  );
};

export default React.memo(PostSwiper);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // backgroundColor: "red",
  },
  containerPost: {
    marginTop: 30,
  },
  hookContainer1: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1001,
    top: 130,
    left: -30,
    position: "absolute",
  },
  hookContainer2: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1001,
    top: 130,
    right: -30,
    position: "absolute",
  },
  borderedContent: {
    width: StoryListItemWidth,
    height: (StoryListItemWidth / 5) * 4.7,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0063AC",
    borderRadius: 15,
  },
  borderedText: {
    fontSize: 15,
    fontFamily: "Figtree-Medium",
    color: "#0063AC",
  },
  noMarginTop: {
    marginTop: 0,
  },
  bodyContainer: {
    gap: 10,
    paddingBottom: 5,
    backgroundColor: "rgba(241, 243, 255, 1)",
    marginBottom: 30,
    width: "100%",
  },
  swipeBodyCnt: {
    position: "absolute",
    left: -50,
    top: 300,
  },
  textContainer: {
    gap: 5,
    paddingLeft: 15,
    width: 300,
  },
});
