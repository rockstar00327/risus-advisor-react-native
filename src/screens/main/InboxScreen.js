import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import BackButton from "../../components/buttons/BackButton";
import Search from "../../assets/icons/search.svg";
import { chatData } from "../../DemoData";
import BottomTab from "../../components/chat/BottomTab";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../constant/BaseConst";
import { formatDate } from "../../func/basicFunc";
import { MaterialIcons } from "@expo/vector-icons";

const InboxScreen = ({ navigation }) => {
  const [mode, setMode] = useState("solo");
  const [soloMsgs, setSoloMsgs] = useState([]);
  const [groupMsgs, setGroupMsgs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSoloMsgs = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await fetch(`${BASE_URL}/api/rooms/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      const result = await response.json();
      //console.log(result.results);
      if (response.ok) {
        setSoloMsgs(result.results);
        setLoading(false);
      }
    } catch (err) {
      //console.log(err);
      setLoading(false);
    }
  };

  const fetchGroupMsgs = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await fetch(`${BASE_URL}/api/rooms/?q=group`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      const result = await response.json();
      // console.log(result.results);
      if (response.ok) {
        setGroupMsgs(result.results);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "solo") {
      fetchSoloMsgs();
    } else {
      fetchGroupMsgs();
    }
  }, [mode]);

  const renderRoundProfiles = () => {
    return (
      <ScrollView
        style={styles.scrollView}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {chatData.map((item, index) => (
          <TouchableOpacity key={index} style={{ position: "relative" }}>
            <Image source={{ uri: item.image }} style={styles.profileImg} />
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                backgroundColor: "orange",
                right: 3,
                //bottom: -26,
                top: 47,
                position: "absolute",
                shadowColor: "#00BFFF",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 3.84,
                elevation: 8,
              }}
            ></View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderInbox = (item, index) => {
    // const truncatedMessage =
    //   item.message.length > 50
    //     ? item.message.slice(0, 50) + "..."
    //     : item.message;

    //const defaultUserImage = "https://randomuser.me/api/portraits/men/2.jpg";

    return (
      <TouchableOpacity
        key={index}
        style={styles.inbox}
        onPress={() => navigation.navigate("conversation", { inbox: item })}
      >
        {item?.personal_room.user.image ? (
          <Image
            source={{
              uri: item.personal_room.user.image,
            }}
            style={styles.Img}
          />
        ) : (
          <Image
            source={require("../../assets/ProfileScreenImages/Profile.jpg")}
            style={styles.Img}
          />
        )}

        <View
          style={{
            flexDirection: "row",
            width: "88%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.textCont}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text style={styles.name}>
                {" "}
                {item.personal_room.user.first_name === ""
                  ? item.personal_room.user.username
                  : `${item.personal_room.user.first_name} ${item.personal_room.user.last_name}`}
              </Text>
              <Text style={styles.date}>
                {" "}
                {item.last_message && formatDate(item.last_message.timestamp)}
              </Text>
            </View>
            <Text style={styles.msg}>{item.last_message?.content}</Text>
          </View>
          {/* <View
            style={{
              width: 8,
              height: 8,
              top: 15,
              left: -10,
              borderRadius: 10,
              backgroundColor: "#7DC8FF",
              // position: "absolute",
            }}
          ></View> */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/*heading */}
      <View style={styles.heading}>
        {/* <MaterialIcons name="chevron-left" size={30} color="#000" /> */}
        <Text style={styles.headTxt}>Chats</Text>
        <TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("SearchScreen")}>
            <MaterialIcons name="search" size={24} color="black" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
      {/*profiles */}
      {/* <View>{renderRoundProfiles()}</View> */}
      {/* Switch tab */}
      {<BottomTab mode={mode} setMode={setMode} />}
      {mode === "solo" ? (
        loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loader}
          />
        ) : (
          <ScrollView
            style={{ marginBottom: 80, marginTop: 5 }}
            showsVerticalScrollIndicator={false}
          >
            {soloMsgs?.length > 0 ? (
              soloMsgs?.map((item, index) => {
                return renderInbox(item, index);
              })
            ) : (
              <Text>No Solo Messages..</Text>
            )}
          </ScrollView>
        )
      ) : loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <ScrollView
          style={{ marginBottom: 80, marginTop: 5 }}
          showsVerticalScrollIndicator={false}
        >
          {groupMsgs?.length > 0 ? (
            groupMsgs?.map((item, index) => {
              return renderInbox(item, index);
            })
          ) : (
            <Text>No Community Messages..</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    marginVertical: 10,
    //paddingVertical: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4.84,
    elevation: 10,
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    fontFamily: "Figtree-Medium",
  },
  heading: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 15,
  },
  headTxt: {
    fontFamily: "Figtree-Medium",
    fontSize: 18,
    textAlign: "center",
  },
  profileImg: {
    width: 57,
    height: 59,
    borderRadius: 4,
    marginRight: 10,
  },
  inbox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    width: "100%",
  },
  Img: {
    width: 42,
    height: 42,
    borderRadius: 4,
  },
  textCont: {
    marginLeft: 8,
  },
  name: {
    fontFamily: "Figtree-Medium",
    fontSize: 16,
  },
  date: {
    fontFamily: "Figtree-Medium",
    fontSize: 12,
    opacity: 0.6,
    marginTop: 0,
    paddingLeft: 0,
  },
  msg: {
    fontFamily: "Figtree-Regular",
    fontSize: 12,
    marginLeft: 5,
    width: "100%",
    marginTop: 3,
  },
});
export default InboxScreen;
