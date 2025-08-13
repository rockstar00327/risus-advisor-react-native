// BlurViewButton.js
import React, { useEffect } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const { height } = Dimensions.get("window");

const BlurViewButton = ({ scrollY }) => {
  const safeScrollY = scrollY || new Animated.Value(0);

  // Interpolations with fallbacks
  const buttonOpacity = safeScrollY.interpolate({
    inputRange: [0, height / 2],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const overlayOpacity = safeScrollY.interpolate({
    inputRange: [0, height / 2],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <>
      {/* <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} /> */}

      <Animated.View style={[styles.container, { opacity: buttonOpacity }]}>
        <BlurView intensity={60} tint="dark" style={styles.blurContainer}>
          <LinearGradient
            colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.2)"]}
            style={styles.gradient}
          >
            <TouchableOpacity style={styles.button} activeOpacity={0.7}>
              <View style={styles.content}>
                <AntDesign
                  name="arrowup"
                  size={20}
                  color="white"
                  style={styles.icon}
                />
                <Text style={styles.text}>Swipe Up to see the reposts</Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </BlurView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 5,
    alignSelf: "center",
    borderRadius: 25,
    overflow: "hidden",
    zIndex: 4,
    left: 50,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 3,
  },
  blurContainer: {
    borderRadius: 25,
    overflow: "hidden",
  },
  gradient: {
    padding: 1,
    borderRadius: 25,
  },
  button: {
    backgroundColor: "rgba(8, 8, 8, 0.01)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: "rgba(208, 203, 203, 0.98)",
    shadowColor: "rgba(208, 203, 203, 0.98)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 10,
    textShadowColor: "#14171A",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 7,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textShadowColor: "#14171A",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
});

export default BlurViewButton;
