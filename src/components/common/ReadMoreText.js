import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ReadMoreText = ({ text }) => {
  const [isReadMore, setIsReadMore] = useState(true);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text} numberOfLines={isReadMore ? 3 : undefined}>
        {isReadMore ? text.slice(0, 50) + "..." : text}
        <Text style={styles.readMore} onPress={toggleReadMore}>
          {isReadMore ? "Read More" : "Show Less"}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  text: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Figtree-Regular",
  },
  readMore: {
    fontFamily: "Figtree-Bold",
  },
});

export default ReadMoreText;
