import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../constant/BaseConst";

//followers dataset
const BridgedData = [
  {
    id: 1,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    userName: "JohnDoe",
    isBridged: false,
  },
  {
    id: 2,
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    userName: "JaneSmith",
    isBridged: false,
  },
  {
    id: 3,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    userName: "AlexBrown",
    isBridged: true,
  },
  {
    id: 4,
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    userName: "ChrisWhite",
    isBridged: true,
  },
  {
    id: 5,
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    userName: "EmilyDavis",
    isBridged: false,
  },
  {
    id: 6,
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    userName: "MichaelClark",
    isBridged: false,
  },
  {
    id: 7,
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    userName: "SarahJohnson",
    isBridged: true,
  },
  {
    id: 8,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    userName: "DavidMartinez",
    isBridged: false,
  },
  {
    id: 9,
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    userName: "OliviaTaylor",
    isBridged: false,
  },
  {
    id: 10,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    userName: "DanielWilson",
    isBridged: false,
  },
  {
    id: 11,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    userName: "SophiaAnderson",
    isBridged: false,
  },
  {
    id: 12,
    image: "https://randomuser.me/api/portraits/men/20.jpg",
    userName: "JamesThomas",
    isBridged: false,
  },
  {
    id: 13,
    image: "https://randomuser.me/api/portraits/men/15.jpg",
    userName: "IsabellaMoore",
    isBridged: false,
  },
  {
    id: 14,
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    userName: "LiamHarris",
    isBridged: false,
  },
  {
    id: 15,
    image: "https://randomuser.me/api/portraits/men/10.jpg",
    userName: "MiaLopez",
    isBridged: false,
  },
];

const NumFollowerScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userId } = route?.params;
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(userId);

  const fetchFollowers = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (userId) {
      try {
        const response = await fetch(
          `${BASE_URL}/api/user/visit/${userId}/get-bridged-users/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );
        const result = await response.json();
        console.log(result);
        if (response.ok) {
          setFollowers(result.results);
          setLoading(false);
        }
        // console.log(result.results);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    } else {
      try {
        const response = await fetch(`${BASE_URL}/api/user/bridge/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
        const result = await response.json();
        //console.log(result);
        if (response.ok) {
          setFollowers(result.results);
          setLoading(false);
        }
        // console.log(result.results);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, []);

  const handleBridgeToggle = (userId) => {
    setFollowers((prevFollowers) =>
      prevFollowers.map((follower) =>
        follower.id === userId
          ? { ...follower, isBridged: !follower.isBridged }
          : follower
      )
    );
  };

  const renderFollowerItem = ({ item }) => (
    <TouchableOpacity
      style={styles.followerItem}
      onPress={() =>
        navigation.navigate("HostProfile", {
          user: {
            user_id: item.id,
            image: item.image,
            display_name: item.username,
          },
        })
      }
    >
      <Image
        source={{ uri: item.image }}
        style={styles.profileImage}
        defaultSource={require("../../assets/ProfileScreenImages/Profile.jpg")}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {item.first_name} {item.last_name}
        </Text>
        <Text style={styles.userHandle}>
          @{item.username.toLowerCase().replace(/\s/g, "")}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.bridgeButton, styles.bridgedButton]}
        onPress={() => handleBridgeToggle(item.id)}
      >
        <Text style={[styles.bridgeButtonText, styles.bridgedButtonText]}>
          {"Bridged"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bridged With</Text>
        <TouchableOpacity
          style={styles.placeholder}
          onPress={() => navigation.navigate("SearchScreen")}
        >
          <MaterialIcons name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0077B5" style={styles.loader} />
      ) : followers.length > 0 ? (
        <>
          {/* Followers count */}
          <View style={styles.countContainer}>
            <Text style={styles.countText}>{followers.length} Bridged </Text>
          </View>
          <FlatList
            data={followers}
            renderItem={renderFollowerItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </>
      ) : (
        <>
          {/* Followers count */}
          <View style={styles.countContainer}>
            <Text style={styles.countText}>{followers.length} Bridged </Text>
          </View>
          <MaterialIcons
            name="person"
            size={100}
            color="#f0f0f0"
            style={styles.personIcon}
          />
          <Text style={styles.noFollowers}>No followers yet!</Text>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Figtree-Bold",
  },
  placeholder: {
    width: 40,
  },
  countContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  countText: {
    fontSize: 16,
    fontFamily: "Figtree-Medium",
    color: "#666",
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  followerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontFamily: "Figtree-Medium",
  },
  userHandle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
    fontFamily: "Figtree-Regular",
  },
  bridgeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#0077B5",
    borderRadius: 20,
  },
  bridgedButton: {
    backgroundColor: "#E8E8E8",
  },
  bridgeButtonText: {
    color: "#fff",
    fontFamily: "Figtree-Medium",
  },
  bridgedButtonText: {
    color: "#666",
    fontFamily: "Figtree-Medium",
  },
  noFollowers: {
    fontSize: 16,
    fontFamily: "Figtree-Medium",
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  personIcon: {
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 50,
  },
});

export default NumFollowerScreen;
