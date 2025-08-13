import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { Image } from "expo-image";
import DummyProfile from "../../../assets/DummyImage/DummyProfile.png";

const RepostImageCard = ({ item, onSelect }) => {
  return (
    <Pressable style={styles.repostCard}>
      {/* main image */}
      <Image
        source={{
          uri:
            typeof item?.images?.[0]?.image === "string"
              ? item.images[0].image
              : DummyProfile,
        }}
        style={styles.mainImage}
        contentFit="cover"
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  repostCard: {
    width: Dimensions.get("window").width * 0.65,
    borderRadius: 16,
    zIndex: 1,
  },
  mainImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E1E8ED",
    borderRadius: 16,
  },
  contentContainer: {
    padding: 8,
  },
});

export default React.memo(RepostImageCard);
