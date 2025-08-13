import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const FAQItem = ({ question, answer }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity
        style={styles.questionContainer}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.question}>{question}</Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="#2C3E50"
        />
      </TouchableOpacity>
      {expanded && <Text style={styles.answer}>{answer}</Text>}
    </View>
  );
};

const FAQScreen = () => {
  const navigation = useNavigation();
  const faqData = [
    {
      question: "What is Risus?",
      answer:
        "Risus is a community-based platform where users contribute ideas, vote, and earn rewards.",
    },

    {
      question: "How does Risus work?",
      answer:
        "Hosts create topics, users submit ideas, vote on the best ones, and top contributors get rewards.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "Go to the login screen, tap 'Forgot Password?' and follow the instructions. Or simply go to the settings and change your password.",
    },

    {
      question: "How do rewards work?",
      answer:
        "Top ideas receive rewards, which may include digital tokens, recognition, or other incentives.",
    },
    {
      question: "The app is not working properly. What should I do?",
      answer:
        "Try restarting the app or checking for updates. If the issue persists, contact support.",
    },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back-outline" size={24} color="#2C3E50" />
      </TouchableOpacity>
      <Text style={styles.title}>Frequently Asked Questions</Text>
      <ScrollView style={styles.scrollContainer}>
        {faqData.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  title: {
    fontSize: 24,
    color: "#2C3E50",
    padding: 20,
    marginBottom: 30,
    textAlign: "center",
    fontFamily: "Figtree-Bold",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  faqItem: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
  },

  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  question: {
    fontSize: 18,
    fontFamily: "Figtree-Bold",
    color: "#2C3E50",
    flex: 1,
    marginRight: 10,
  },
  answer: {
    fontSize: 16,
    color: "#5D6D7E",
    marginTop: 12,
    lineHeight: 20,
    fontFamily: "Figtree-Regular",
  },
  backButton: {
    padding: 16,
  },
});

export default FAQScreen;
