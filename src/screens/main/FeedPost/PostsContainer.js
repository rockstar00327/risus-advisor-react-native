import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
  RefreshControl,
  FlatList,
} from "react-native";
import React, { useRef, useState } from "react";
import FeedHeader from "../../../components/feed/FeedHeader";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Post from "./Post";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import BlurViewButton from "./BlurViewButton";

const { width, height } = Dimensions.get("window");

const PostsContainer = ({
  feedData,
  avatar,
  loading,
  onLoadMore,
  onRefresh,
  refreshing,
  isLoadingMore,
  notifications,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleIndex, setVisibleIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setVisibleIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  }).current;

  const userImage = "https://randomuser.me/api/portraits/lego/4.jpg";

  const renderPost = ({ item }) => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Post data={item} />
    </ScrollView>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#97D3FF" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <LinearGradient
        colors={["rgba(125, 201, 255, 0.11)", "rgba(255, 255, 255, 0.3)"]}
        style={styles.container}
      >
        {/* Feed Header */}
        <FeedHeader
          userImage={avatar || userImage}
          notifications={notifications}
        />

        {/* Content Area */}

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#97D3FF"
            style={styles.loader}
          />
        ) : feedData.length > 0 ? (
          <FlatList
            data={feedData}
            // renderItem={renderPost}
            renderItem={({ item, index }) => (
              <Post data={item} isFocused={index === visibleIndex} />
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            keyExtractor={(item, index) => index}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            pagingEnabled={true} // Ensures one post at a time
            snapToInterval={width} // Snap to full width
            decelerationRate="fast"
            contentContainerStyle={styles.contentContainer}
            removeClippedSubviews={true}
            initialNumToRender={5}
            maxToRenderPerBatch={3}
            windowSize={5}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={refreshing}
            //     onRefresh={onRefresh}
            //     tintColor="#97D3FF"
            //     colors={["#97D3FF"]}
            //     progressViewOffset={10}
            //   />
            // }
            scrollEventThrottle={16}
            //stickyHeaderIndices={[1]}
            // onScrollBeginDrag={() => console.log("Scroll began")}
            //onRefresh={onRefresh}
            //refreshing={refreshing}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <MaterialIcons name="sentiment-neutral" size={50} color="#97D3FF" />
            <Text style={styles.emptyStateText}>No Feed Posts!</Text>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.86)",
    minHeight: height + 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    //paddingHorizontal: width * 0.05,
    paddingBottom: 60,
    paddingTop: 5,
    minHeight: height + 1,
  },
  loader: {
    marginVertical: height * 0.03,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: "Figtree-Bold",
    color: "#536471",
    marginTop: 12,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default React.memo(PostsContainer);
