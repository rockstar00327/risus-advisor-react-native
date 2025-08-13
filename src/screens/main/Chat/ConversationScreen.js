import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import SendImg from "../../../assets/icons/send-2.svg";
import { conversations, messages } from "../../../DemoData";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_SOCKET_URL, BASE_URL } from "../../../constant/BaseConst";
import { formatDate } from "../../../func/basicFunc";

const ConversationScreen = ({ navigation, route }) => {
  const { inbox } = route.params || [];
  const [loading, setLoading] = useState(true);
  const [msgs, setMsgs] = useState([]);
  const [userProfile, setUserProfile] = useState(null); // Default profile image
  const [userName, setUserName] = useState("You");
  const [newMsg, setNewMsg] = useState("");
  const [showDetailId, setShowDetailId] = useState(null);
  //console.log(inbox);

  const fetchMsgs = useCallback(async () => {
    //setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const { data } = await axios.get(
        `${BASE_URL}/api/rooms/${inbox.id}/messages/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      console.log(data.results);
      if (data.results) {
        setMsgs(data.results);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setLoading(false);
    }
  }, []);

  const connectWebSocket = async () => {
    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      console.log("No token found, cannot connect to WebSocket.");
      return;
    }

    const ws = new WebSocket(`${BASE_SOCKET_URL}/chat/?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket connected!");
    };

    ws.onmessage = (event) => {
      try {
        const newMessage = JSON.parse(event.data); // Parse the received message
        console.log("Received message:", newMessage);

        setMsgs((prevMsgs) => [...prevMsgs, newMessage]);
        setNewMsg(""); // Add the new message to the existing messages
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.warn("WebSocket closed!", event.code, event.reason);
    };

    return ws;
  };

  const createMessage = async () => {
    if (newMsg === "") return;
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.post(
        `${BASE_URL}/api/rooms/${inbox.id}/messages/`,
        {
          content: newMsg,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      if (response.ok) {
        setNewMsg("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const ws = connectWebSocket();

    return () => {
      ws?.then((socket) => socket.close()); // Cleanup WebSocket connection on unmount
    };
  }, []);

  useEffect(() => {
    fetchMsgs();
    const loadUserData = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem("userName");
        const storedUserProfile = await AsyncStorage.getItem("userProfile");

        if (storedUserName) setUserName(storedUserName);
        if (storedUserProfile) setUserProfile(JSON.parse(storedUserProfile));
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  const toggleShowDetail = (id) => {
    setShowDetailId(showDetailId === id ? null : id);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => toggleShowDetail(item.id)}>
      <View
        style={[
          styles.messageContainer,
          item.is_me ? styles.myMessage : styles.theirMessage,
        ]}
      >
        {!item.is_me && (
          <>
            {item.user?.image ? (
              <Image
                source={{
                  uri: item.user.image,
                }}
                style={styles.avatar}
              />
            ) : (
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/women/40.jpg",
                }}
                style={styles.avatar}
              />
            )}
          </>
        )}
        <View
          style={{
            maxWidth: "100%",
            flexDirection: "column",
            //alignItems: "center",
          }}
        >
          <View
            style={[
              styles.bubble,
              item.is_me ? styles.myBubble : styles.theirBubble,
            ]}
          >
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
          {showDetailId === item.id && (
            <View style={[styles.row, { marginLeft: 10, top: 12 }]}>
              {item.seen_at && (
                <Text style={styles.seen}>Seen at {item.seen_at}</Text>
              )}
              <Text style={styles.time}>{formatDate(item.timestamp)}</Text>
            </View>
          )}
        </View>
        {item.is_me && (
          <>
            {userProfile?.image ? (
              <Image
                source={{ uri: userProfile?.image }}
                style={styles.avatar}
              />
            ) : (
              <Image
                source={{
                  uri:
                    item.user.image ||
                    "https://randomuser.me/api/portraits/men/45.jpg",
                }}
                style={styles.avatar}
              />
            )}
          </>
        )}
        {/* {item.is_me && (
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/45.jpg" }}
          style={[styles.avatar, { top: 5 }]}
        />
      )} */}
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#CEEAFF", "#f6f6f6"]}
      start={{ x: 1, y: -1 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/*heading */}
      <View style={styles.heading}>
        <View style={[styles.row]}>
          <MaterialIcons
            name="arrow-back-ios"
            size={20}
            color="#fff"
            onPress={() => navigation.goBack()}
          />

          <View style={[styles.friendCnt]}>
            {inbox?.personal_room.user.image ? (
              <Image
                source={{
                  uri: inbox?.personal_room.user.image,
                }}
                style={styles.friendImg}
              />
            ) : (
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/women/40.jpg",
                }}
                style={styles.friendImg}
              />
            )}
            <Text style={styles.headTxt}>
              {inbox?.personal_room?.user?.first_name}
            </Text>
          </View>
        </View>
        {/* <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="#fff" />
        </TouchableOpacity> */}
      </View>
      {/* Conversations */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : msgs.length > 0 ? (
        <FlatList
          data={msgs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={[styles.chatContainer]}
          contentContainerStyle={{
            paddingBottom: 80,
            marginBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
        />
      ) : null}

      {/* Bottom send bar */}
      <View style={[styles.row, styles.bottomCnt]}>
        <View style={[styles.row, styles.msgInputCnt]}>
          <View style={[styles.row]}>
            {/* <PhotoImg style={{ width: 20, height: 20 }} /> */}
            <TextInput
              value={newMsg}
              onChangeText={setNewMsg}
              placeholder="Message..."
              style={[styles.input]}
            />
          </View>
          <View style={[styles.row]}>
            {/* <AttachImg style={{ width: 20, height: 20, marginRight: 10 }} />
            <MicroImg style={{ width: 20, height: 20, marginLeft: 5 }} /> */}
          </View>
        </View>
        {/* Send Button */}
        <TouchableOpacity
          onPress={createMessage}
          disabled={newMsg === ""}
          style={[styles.row, styles.sendBtn]}
        >
          <SendImg style={{ width: 30, height: 30, marginLeft: 5 }} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default ConversationScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    //paddingHorizontal: 20,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    top: 0,
  },
  headTxt: {
    fontFamily: "Figtree-Medium",
    fontSize: 14,
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  friendCnt: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 6,
  },
  bottomCnt: {
    position: "absolute",
    bottom: 0,
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 10,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  sendBtn: {
    width: 43,
    height: 43,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 10,
    justifyContent: "center",
    shadowColor: "#363636",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 3,
  },
  msgInputCnt: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 10,
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 4,
    width: "85%",
    marginRight: 8,
    // flex: 1,
    height: 45,
    shadowColor: "#363636",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 3,
  },
  input: {
    width: "100%",
    marginLeft: 5,
    fontFamily: "Figtree-Regular",
    fontSize: 16,
  },
  chatContainer: {
    paddingHorizontal: 5,
    //top: 16,
    marginBottom: 96,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,

    // borderWidth: 1,
    // borderColor: "#000",
    //maxWidth: "100%",
  },
  myMessage: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    width: "80%",
  },
  theirMessage: {
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    width: "80%",
  },
  bubble: {
    maxWidth: "100%",
    top: 10,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 12,
  },
  myBubble: {
    backgroundColor: "#CEEAFF",
    //borderTopRightRadius: 5,
    alignSelf: "flex-end",
  },
  theirBubble: {
    backgroundColor: "#fff",
    //borderTopLeftRadius: 5,
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 12.5,
    color: "#000",
    fontFamily: "Fugaz-Bold", //only for chats
    lineHeight: 18,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 8,
    marginHorizontal: 8,
    marginTop: 13,
  },
  friendImg: {
    width: 38,
    height: 38,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  seen: {
    fontFamily: "Figtree-Regular",
    fontSize: 10,
    marginRight: 20,
    color: "#acacad",
  },
  time: {
    fontFamily: "Figtree-Regular",
    fontSize: 10,
    color: "#acacad",
  },
});
