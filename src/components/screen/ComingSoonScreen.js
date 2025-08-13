import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function ComingSoonScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="rocket" size={24} color="#0059d6" />
      <Text style={styles.title}>Coming Soon!</Text>
      <Text style={styles.subtitle}>
        We’re working hard to bring you this feature.
      </Text>
      {/* <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Notify Me</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f7fa",
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
