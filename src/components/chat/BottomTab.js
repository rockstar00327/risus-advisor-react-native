import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import ActiveChatIcon from "../../assets/chat/chat.png";
import BlurGroupChatIcon from "../../assets/chat/group-chat.png";
import { Ionicons } from "@expo/vector-icons";

const BottomTab = ({ mode, setMode }) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
      <TouchableOpacity onPress={() => setMode("solo")}>
        <View style={styles.iconCont}>
          <Text
            style={mode === "solo" ? styles.activeIconTxt : styles.iconText}
          >
            Solo Message
          </Text>
        </View>
        {/* <Image source={ActiveSolo MessageIcon} style={styles.image1} /> */}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setMode("community")}>
        <View style={[styles.iconCont, { marginLeft: 30 }]}>
          <Text
            style={
              mode === "community" ? styles.activeIconTxt : styles.iconText
            }
          >
            Community
          </Text>
        </View>
        {/* <Image source={BlurGroupSolo MessageIcon} style={styles.image} /> */}
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  container: {
    // position: "absolute",
    // bottom: 70,
    //width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    flexDirection: "row",
    //alignItems: "center",
    //justifyContent: "space-between",
  },
  tabContainer: {
    backgroundColor: "rgb(227, 247, 255)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 1,
    // shadowRadius: 2.84,
    // elevation: 5,
  },
  iconCont: {
    //justifyContent: "space-between",
    flexDirection: "column",
    justifyContent: "center",
  },
  iconText: {
    paddingHorizontal: 3,
    paddingVertical: 5,
    color: "#000",
    fontFamily: "Figtree-Medium",
    fontSize: 13,
  },
  activeIconTxt: {
    backgroundColor: "#fff",
    paddingHorizontal: 7,
    paddingVertical: 3,
    color: "#000",
    fontFamily: "Figtree-Medium",
    fontSize: 13,
    borderRadius: 10,
  },
});
