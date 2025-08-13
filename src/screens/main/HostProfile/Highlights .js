import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import React from "react";
import Pic4 from "../../../assets/images/pic1.png";
import Pic2 from "../../../assets/images/pic2.png";
import Pic3 from "../../../assets/images/pic3.png";
import Pic1 from "../../../assets/images/post1.jpg";

const Images = [Pic1, Pic2, Pic3, Pic4];

const Highlights = ({ user }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Highlights </Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {Images.map((item, index) => (
          <Image source={item} key={index} style={styles.images} />
        ))}
      </ScrollView>
    </View>
  );
};

export default Highlights;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Figtree-Bold",
  },
  images: {
    width: 98,
    height: 120,
    borderRadius: 12,
    marginTop: 15,
    marginRight: 10,
  },
});
