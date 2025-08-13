import React from "react";
import RepostIcon from "../../assets/icons/repost.svg";
import { Pressable, StyleSheet, View } from "react-native";

const RepostButton = ({ handlePress }) => {
  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <View style={styles.innerCircle}>
        <RepostIcon style={{ width: 15, height: 15 }} />
      </View>
    </Pressable>
  );
};

export default RepostButton;

const styles = StyleSheet.create({
  container: {
    width: 45,
    height: 45,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#CEEAFF",
  },
  innerCircle: {
    width: 28,
    height: 28,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
