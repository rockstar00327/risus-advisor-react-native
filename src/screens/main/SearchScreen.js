import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../constant/BaseConst";

const { width } = Dimensions.get("window");

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchAnimation = useRef(new Animated.Value(0)).current;

  const categories = [
    { id: "1", name: "Business", icon: "briefcase" },
    { id: "2", name: "Marketing", icon: "megaphone" },
    { id: "3", name: "Technology", icon: "laptop" },
    { id: "4", name: "Finance", icon: "card" },
    { id: "5", name: "Design", icon: "color-palette" },
    { id: "6", name: "Growth", icon: "trending-up" },
  ];

  const trendingTopics = [
    { id: "1", topic: "Business Growth" },
    { id: "2", topic: "Marketing Tips" },
    { id: "3", topic: "Startup Guide" },
    { id: "4", topic: "Social Media" },
  ];
  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem("authToken");

    if (searchQuery.trim() === "") return;
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/user/get-share-list/?${searchQuery}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      const result = await response.json();
      //console.log(result);
      if (response.ok) {
        setAllUsers(result);
        setLoading(false);
      }
      // console.log(result.results);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  useEffect(() => {
    Animated.spring(searchAnimation, {
      toValue: isFocused ? 1 : 0,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
  }, [isFocused]);

  const toggleUserSelection = (user) => {
    navigation.navigate("HostProfile", {
      user: {
        user_id: user.id,
        image: user.image,
        display_name: user.username,
      },
    });
    if (selectedUsers.some((selectedUser) => selectedUser.id === user.id)) {
      setSelectedUsers(
        selectedUsers.filter((selectedUser) => selectedUser.id !== user.id)
      );
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryIcon}>
        <Ionicons name={item.icon} size={22} color="#58AFFF" />
      </View>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderUserItem = ({ item }) => {
    const isSelected = selectedUsers.some((user) => user.id === item.id);

    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => toggleUserSelection(item)}
        activeOpacity={0.7}
      >
        <View style={styles.userInfoContainer}>
          <Image source={{ uri: item.image }} style={styles.userImage} />
          <Text style={styles.username}>
            {item.first_name} {item.last_name}
          </Text>
        </View>
        <View
          style={[
            styles.checkCircle,
            isSelected ? styles.selectedCheckCircle : {},
          ]}
        >
          {isSelected && <Ionicons name="locate" size={20} color="black" />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.searchContainer,
            {
              transform: [
                {
                  scale: searchAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.02],
                  }),
                },
              ],
            },
          ]}
        >
          <Ionicons name="search" size={20} color="#58AFFF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#58AFFF" />
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0077B5" style={styles.loader} />
      ) : allUsers.length > 0 && searchQuery !== "" ? (
        <FlatList
          data={allUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.userList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.categoriesContainer}
          />

          <Text style={styles.sectionTitle}>Trending</Text>
          {trendingTopics.map((item) => (
            <TouchableOpacity key={item.id} style={styles.trendingItem}>
              <Ionicons name="trending-up" size={20} color="#58AFFF" />
              <Text style={styles.trendingText}>{item.topic}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F9FF",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Figtree-Regular",
    color: "#333",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Figtree-Bold",
    color: "#333",
    marginBottom: 20,
    marginTop: 10,
  },
  categoriesContainer: {
    gap: 15,
    marginBottom: 30,
  },
  categoryItem: {
    width: (width - 60) / 3,
    alignItems: "center",
    marginBottom: 15,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#F5F9FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "Figtree-Medium",
    color: "#333",
    textAlign: "center",
  },
  trendingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F9FF",
    gap: 12,
  },
  trendingText: {
    fontSize: 15,
    fontFamily: "Figtree-Regular",
    color: "#333",
  },
  userList: {
    //maxHeight: 400,
    paddingHorizontal: 10,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f5",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Figtree-Regular",
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCheckCircle: {
    backgroundColor: "#CEEAFF",
    borderColor: "#CEEAFF",
  },
});

export default SearchScreen;
