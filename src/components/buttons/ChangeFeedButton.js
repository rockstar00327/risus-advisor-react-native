import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const ChangeFeedButton = ({ title, value, active, handleClick }) => (
  <TouchableOpacity
    onPress={() => handleClick(value)}
    style={[styles.feedButton, active && styles.feedButtonActive]}
  >
    <Text style={[styles.text, active && styles.textActive]}>{title}</Text>
  </TouchableOpacity>
);

export default ChangeFeedButton;

const styles = StyleSheet.create({
  feedButton: {
    flexGrow: 1,
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRadius: 15,
    justifyContent: "center",
    backgroundColor: "#FFF",
    shadowColor: "#0000001A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  feedButtonActive: {
    backgroundColor: "#CEEAFF",
  },
  text: {
    fontSize: 13,
    color: "#00000080",
    textAlign: "center",
    fontFamily: "Figtree-Medium",
  },
  textActive: {
    fontSize: 13,
    color: "#000",
    textAlign: "center",
    fontFamily: "Figtree-Regular",
  },
});
