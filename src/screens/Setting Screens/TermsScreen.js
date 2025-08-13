import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const TermsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Section
          icon="info"
          title="Introduction"
          content="Welcome to Risus, a community-driven platform for sharing and voting on ideas. These Terms and Conditions govern your use of the Risus mobile application and services. By using Risus, you agree to comply with and be bound by these terms."
        />

        <Section
          icon="person"
          title="User Accounts & Responsibilities"
          content="Users must be 13 or older to create an account. You are responsible for maintaining the confidentiality of your account credentials and all activities under your account. Accounts must provide accurate information and may not impersonate others."
        />

        <Section
          icon="edit"
          title="Content Guidelines"
          content="Users retain ownership of their submitted ideas but grant Risus a license to display and promote them. Content must not violate intellectual property rights, contain harmful material, or promote illegal activities. Risus reserves the right to remove any content that violates these guidelines."
        />

        <Section
          icon="how-to-vote"
          title="Voting & Rewards"
          content="Users can vote on ideas following our fair use policy. Rewards are distributed based on community engagement and contribution quality. Risus reserves the right to modify the reward system and eligibility criteria. Rewards have no monetary value and cannot be exchanged for cash."
        />

        <Section
          icon="security"
          title="Privacy & Data Usage"
          content="We collect and process user data as outlined in our Privacy Policy. This includes profile information, usage data, and submitted content. We implement security measures to protect user data but cannot guarantee absolute security."
        />

        <Section
          icon="block"
          title="Prohibited Activities"
          content="Users may not engage in spam, harassment, fraud, or any illegal activities. Automated voting, multiple accounts, and manipulation of the reward system are strictly prohibited."
        />

        <Section
          icon="cancel"
          title="Account Termination"
          content="Risus may suspend or terminate accounts for Terms violations, extended inactivity, or at our discretion. Users may delete their accounts at any time, subject to ongoing obligations under these Terms."
        />

        <Section
          icon="gavel"
          title="Liability & Disclaimers"
          content="Risus provides the platform 'as is' without warranties. We are not liable for user-generated content, service interruptions, or any consequential damages. Users use the app at their own risk."
        />

        <Section
          icon="balance"
          title="Governing Law"
          content="These Terms are governed by applicable laws. Any disputes will be resolved through arbitration before seeking legal action. Users agree to resolve disputes individually, not through class actions."
        />

        <Section
          icon="update"
          title="Modifications"
          content="Risus may update these Terms at any time. Continued use after changes constitutes acceptance. For questions, contact support@Risus.com."
        />

        {/* <TouchableOpacity style={styles.acceptButton}>
          <Text style={styles.acceptButtonText}>I Accept the Terms & Conditions</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};

const Section = ({ icon, title, content }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <MaterialIcons name={icon} size={24} color="rgba(0, 132, 255, 0.52)" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <Text style={styles.sectionContent}>{content}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 20,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 16,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Figtree-Bold",
    flex: 1,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    padding: 16,
    paddingBottom: 90,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 4,
    borderColor: "rgba(215, 236, 255, 0.92)",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Figtree-Bold",
    marginLeft: 12,
  },
  sectionContent: {
    fontSize: 16,
    fontFamily: "Figtree-Regular",
    lineHeight: 25,
    color: "#666",
  },
  acceptButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 16,
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default TermsScreen;
