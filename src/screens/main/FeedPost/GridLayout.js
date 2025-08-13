import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  // Image,
  Text,
  ScrollView,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import Svg, { Path, Circle, G } from "react-native-svg";
import { formatDate } from "../../../func/basicFunc";
import HookImg from "../../../assets/images/hook.svg"; // Assuming you have a hook image

const { width: screenWidth } = Dimensions.get("window");

const GridLayoutScreen = ({ route, navigation }) => {
  const { post, reposts, onSelectRepost } = route.params;

  const renderConnectingHooks = (num) => {
    const mainPostBottom = 280; // Approximate position of main post bottom
    const gridStartY = 380; // Where grid items start
    const hookLength = 40; // Length of the hook part

    return (
      <Svg
        height="200"
        width={screenWidth}
        style={
          num === "2"
            ? styles.connectingLines2
            : num === "1"
            ? styles.connectingLines
            : styles.connectingLines0
        }
      >
        {/* Top Circle */}
        <Circle cx={screenWidth / 2.06} cy={30} r={5} fill="white" />

        {/* Hook Image */}
        <G x={screenWidth / 2 - 10} y={30}>
          <HookImg width={8} height={20} />
        </G>

        {/* Bottom Circle */}
        <Circle cx={screenWidth / 2.06} cy={50} r={5} fill="white" />
      </Svg>
    );
  };
  console.log(post.images[0].image);

  const renderMainPost = () => (
    <View style={styles.mainPostContainer}>
      <View style={styles.mainPost}>
        <View style={styles.postHeader}>
          <Image source={{ uri: post.user?.image }} style={styles.userAvatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {post.user?.display_name || "Sophia Luna"}
            </Text>
            <Text style={styles.userHandle}>
              @{post.user?.username.split("@")[0] || "sophialuna"} •{" "}
              {formatDate(post?.date_created) || "1m ago"}
            </Text>
          </View>
        </View>
        <Image
          source={{ uri: post.images[0].image }}
          style={styles.mainPostImage}
          resizeMode="cover"
        />
        <View style={styles.postTextOverlay}>
          <Text style={styles.postText}>
            {post.content ||
              "Es Un Hecho Establecido Hace Demasiado Del Texto De Un Sitio Mientras Que Mira Su Diseño"}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderGridItem = ({ item, index }) => (
    <>
      <TouchableOpacity
        style={[
          styles.gridItem,
          index === reposts.length - 1 && reposts.length % 2 === 1
            ? styles.fullWidthItem
            : null,
        ]}
        onPress={() => {
          navigation.goBack();
          onSelectRepost(item);
        }}
      >
        <View style={styles.gridItemHeader}>
          <Image
            source={{ uri: item.user?.image }}
            style={styles.gridUserAvatar}
          />
          <View style={styles.gridUserInfo}>
            <Text style={styles.gridUserName}>
              {item.user.display_name || `User ${index + 1}`}
            </Text>
            <Text style={styles.gridUserHandle}>
              {/* @{item.user.username || `user${index + 1}`} •{" "} */}
              {formatDate(item.date_created) || "1m ago"}
            </Text>
          </View>
        </View>
        <Image
          source={{ uri: item.images[0].image }}
          style={styles.gridImage}
          resizeMode="cover"
        />
        {item.content && (
          <View style={styles.gridTextOverlay}>
            <Text style={styles.gridPostText} numberOfLines={2}>
              {item.content}
            </Text>
          </View>
        )}
        {/* Connection point indicator */}

        {/* <View style={styles.connectionPoint} /> */}
      </TouchableOpacity>
      {/* {renderConnectingHooks("0")} */}
    </>
  );

  return (
    <View style={styles.container}>
      <BlurView intensity={30} style={StyleSheet.absoluteFill} />

      <ScrollView style={styles.scrollContainer}>
        {/* Main Post */}
        {renderMainPost()}

        {/* Connecting Lines */}
        {renderConnectingHooks("1")}
        {renderConnectingHooks("2")}

        {/* Grid of Reposts */}
        <View style={styles.gridContainer}>
          <FlatList
            data={reposts}
            numColumns={2}
            scrollEnabled={false}
            renderItem={renderGridItem}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={reposts.length > 1 ? styles.row : null}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(240,240,240,0.95)",
  },
  scrollContainer: {
    flex: 1,
    marginTop: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationBadge: {
    backgroundColor: "black",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#87CEEB",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchIcon: {
    fontSize: 18,
  },
  headerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  mainPostContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  mainPost: {
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 15,
    overflow: "hidden",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingBottom: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  userHandle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  mainPostImage: {
    width: "100%",
    height: 200,
  },
  postTextOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
  },
  postText: {
    color: "white",
    fontSize: 14,
    lineHeight: 18,
  },
  connectingLines: {
    position: "absolute",
    top: 230,
    left: -90,
    bottom: 0,
    zIndex: 1,
  },
  connectingLines0: {
    position: "absolute",
    top: 100,
    left: 30,
    bottom: 0,
    zIndex: 1,
  },
  connectingLines2: {
    position: "absolute",
    top: 230,
    right: -90,
    bottom: 0,
    zIndex: 1,
  },
  gridContainer: {
    paddingHorizontal: 20,
    zIndex: 0,
    marginTop: -10,
    //paddingTop: 40,
  },
  row: {
    justifyContent: "space-between",
  },
  gridItem: {
    width: (screenWidth - 50) / 2,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    position: "relative",
  },
  fullWidthItem: {
    width: screenWidth - 40,
  },
  gridItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingBottom: 5,
  },
  gridUserAvatar: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    marginRight: 8,
  },
  gridUserInfo: {
    flex: 1,
  },
  gridUserName: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  gridUserHandle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
  },
  gridImage: {
    width: "100%",
    height: 120,
  },
  gridTextOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
  },
  gridPostText: {
    color: "white",
    fontSize: 11,
    lineHeight: 14,
  },
  connectionPoint: {
    position: "absolute",
    top: -10,
    left: "50%",
    marginLeft: -5,
    width: 10,
    height: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
});

export default GridLayoutScreen;
