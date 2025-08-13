import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import LeftArrow from "../../assets/icons/left-arrow.svg";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BackButton = ({ navigation }) => {
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        {/* <Image source={LeftArrow} style={{ width: 24, height: 24 }} /> */}
        <Ionicons name="chevron-back" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default BackButton;
