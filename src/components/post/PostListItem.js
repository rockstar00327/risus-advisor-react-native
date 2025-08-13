import Animated, {
  interpolate,
  Extrapolation,
  useAnimatedStyle,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import { Dimensions } from "react-native";
import React, { memo, useMemo } from "react";
const ITEM_MARGIN_TOP = 30;
const { width: WINDOW_WIDTH } = Dimensions.get("screen");
const STORY_LIST_ITEM_WIDTH = WINDOW_WIDTH * 0.7;
const LIST_PADDING = WINDOW_WIDTH - STORY_LIST_ITEM_WIDTH;
const STORY_LIST_ITEM_HEIGHT = (STORY_LIST_ITEM_WIDTH / 3) * 4.6;
const PADDING_LEFT = (WINDOW_WIDTH - STORY_LIST_ITEM_WIDTH) / 0.8;
const TRANSLATE_X_OUTPUT = [
  WINDOW_WIDTH + PADDING_LEFT * 1.4,
  330,
  40,
  -WINDOW_WIDTH + PADDING_LEFT * 0.98,
];
const SCALE_OUTPUT = [0.8, 0.9, 1, 0.9];

const STATIC_CONTAINER_STYLE = {
  position: "absolute",
  width: STORY_LIST_ITEM_WIDTH,
};

export {
  LIST_PADDING as ListPadding,
  WINDOW_WIDTH as WindowWidth,
  ITEM_MARGIN_TOP as ItemSpacing,
  STORY_LIST_ITEM_WIDTH as StoryListItemWidth,
  STORY_LIST_ITEM_HEIGHT as StoryListItemHeight,
  PADDING_LEFT as PADDING_LEFT,
};

export const PostListItem = memo(
  ({ index, children, scrollOffset, post, nextPost }) => {
    const inputRange = useMemo(
      () => [index - 2, index - 1, index, index + 1, index + 2],
      [index]
    );

    const TRANSLATE_Y_OUTPUT = [25, 25, 0, 25, 25];

    const rContainerStyle = useAnimatedStyle(() => {
      const offset = scrollOffset.value;
      const activeIndex = offset / STORY_LIST_ITEM_WIDTH;
      const isActive = Math.round(activeIndex) === index;
      const zIndex = isActive ? 10 : -index;

      let translateX = !post?.id
        ? interpolate(
          activeIndex,
          inputRange,
          TRANSLATE_X_OUTPUT,
          Extrapolation.CLAMP
        )
        : interpolate(
          activeIndex,
          inputRange,
          TRANSLATE_X_OUTPUT,
          Extrapolation.CLAMP
        );

      // Conditional Y translation
      const translateY = !post?.id
        ? 0
        : interpolate(
          activeIndex,
          inputRange,
          TRANSLATE_Y_OUTPUT,
          Extrapolation.CLAMP
        );

      const scale = !post?.id
        ? 0.9
        : interpolate(
          activeIndex,
          inputRange,
          SCALE_OUTPUT,
          Extrapolation.CLAMP
        );

      let width = STORY_LIST_ITEM_WIDTH;
      if (isActive && index === 0) {
        width = WINDOW_WIDTH * 0.75;
        translateX -= 10;
      }

      return {
        zIndex,
        width,
        transform: [
          { translateX: scrollOffset.value + translateX },
          { scale: !!nextPost ? scale : 0.97 },
          { translateY: !!nextPost ? translateY : 0 },
        ],
      };
    }, [index, inputRange, scrollOffset, post?.id]);

    return (
      <Animated.View style={[STATIC_CONTAINER_STYLE, rContainerStyle]}>
        {children}
      </Animated.View>
    );
  }
);
