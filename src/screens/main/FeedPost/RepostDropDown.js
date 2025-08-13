import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import RepostCard from "./RepostCard";
import BlurViewButton from "./BlurViewButton";

const { width } = Dimensions.get("window");
const REPOST_WIDTH = width * 0.43; // Keep the current width

const RepostDropDown = ({ repostData, loading }) => {
  const navigation = useNavigation();

  // Filter out posts without images
  const validReposts = repostData.filter(
    (item) =>
      item?.images && Array.isArray(item.images) && item.images.length > 0
  );

  // const renderRepost = ({ item }) => <RepostCard item={item} />;

  return (
    <View style={styles.container}>
      <BlurViewButton />
      <View style={{}}>
        {validReposts.map((item, index) => (
          <RepostCard item={item} key={index} />
        ))}
      </View>
      {/* <GestureHandlerRootView style={{ flex: 1 }}>
        <GHFlatList
          data={validReposts} // Use filtered data
          renderItem={renderRepost}
          keyExtractor={(item) => `repost-${item.id}`}
          // horizontal
          // showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          snapToInterval={REPOST_WIDTH + 12}
          decelerationRate="fast"
          contentContainerStyle={styles.listContainer}
        />
      </GestureHandlerRootView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginTop: 8,
    marginBottom: 10,
    //height: 180,
  },
  listContainer: {},
  repostCard: {
    width: REPOST_WIDTH,
    marginHorizontal: 6,
    backgroundColor: "white",
    borderRadius: 16,
    // overflow: "hidden",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderTopLeftRadius: 16,
    paddingRight: 10,
    maxWidth: "90%",
  },
  avatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
  },
  username: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  mainImage: {
    width: "100%",
    height: 120, // Reduced height
    backgroundColor: "#E1E8ED",
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

export default RepostDropDown;
