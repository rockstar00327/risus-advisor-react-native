import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

const { width } = Dimensions.get("window");

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Backgrounds */}
      <View style={styles.circleDecoration} />
      <View style={styles.circleDecoration2} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.toText}>to </Text>
            {/* Center - Risus Logo */}
            <View style={styles.centerLogo}>
              <Text style={styles.logo}>Risus</Text>
              {/* <AdVisorLogo width={89} height={20} /> */}
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("Register")}
            style={styles.getStartedButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Get Started
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate("Login")}
            style={styles.loginButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.loginButtonLabel}
          >
            Log In
          </Button>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  circleDecoration: {
    position: "absolute",
    top: -width * 0.3,
    right: width * 0.6,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "rgba(125, 200, 255, 0.3)",
  },
  circleDecoration2: {
    position: "absolute",
    bottom: -width * 0.3,
    left: width * 0.6,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "rgba(125, 200, 255, 0.3)",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    paddingTop: "30%",
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 150,
  },
  welcomeText: {
    fontSize: 42,
    color: "#333",
    marginBottom: 8,
    fontFamily: "Figtree-Regular",
  },
  // centerLogo: {
  //   flex: 2,
  //   alignItems: "center",
  // },
  logo: {
    fontFamily: "Briem-Medium",
    fontSize: 45,
    color: "#7DC8FF",
    letterSpacing: 0.8,
    marginTop: -1,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  toText: {
    fontSize: 42,
    color: "#333",
    fontFamily: "Figtree-Regular",
  },
  advisorText: {
    fontFamily: "Briem-Medium",
    fontSize: 55,
    color: "#87CEEB",
  },
  buttonContainer: {
    paddingHorizontal: 0,
    paddingBottom: 40,
    gap: 25,
  },
  buttonContent: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0,
  },
  getStartedButton: {
    width: "75%",
    left: "25%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
    borderRadius: 0,
    borderTopRightRadius: 80,
    borderBottomLeftRadius: 80,
    elevation: 4,
    backgroundColor: "#CEEAFF",
    shadowColor: "#87CEEB",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  buttonLabel: {
    fontSize: 20,
    // marginTop: 15,
    height: 45,
    letterSpacing: 0.5,
    color: "#5CBAFF",
    fontFamily: "Figtree-Bold",
    paddingVertical: 0, // Ensures no extra padding
    textAlignVertical: "center", // Centers text inside button
  },
  loginButton: {
    width: "50%",
    height: 45,
    borderRadius: 0,
    borderTopLeftRadius: 80,
    borderBottomRightRadius: 80,
    backgroundColor: "rgba(92, 186, 255, 0.54)",
    borderColor: "#87CEEB",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  loginButtonLabel: {
    fontSize: 16,
    color: "#000000",
    fontFamily: "Figtree-Bold",
    textAlignVertical: "center",
    includeFontPadding: false,
    padding: 0,
    margin: 0,
    height: "auto",
    minHeight: 16,
  },
});

export default WelcomeScreen;
