import { View, ScrollView, StyleSheet, Image } from "react-native";
import React, { useState } from "react";
import {
  Avatar,
  Text,
  Card,
  Button,
  List,
  TextInput,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomAlert from "../../components/CustomAlert";
import { MaterialIcons } from "@expo/vector-icons";
import ComingSoonScreen from "../../components/screen/ComingSoonScreen";

const AccountSet = () => {
  const [expandedPayment, setExpandedPayment] = useState(false);
  const [expandedRewards, setExpandedRewards] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Alert states
  const [alert, setAlert] = useState({
    visible: false,
    type: "success",
    message: "",
  });

  const showAlert = (type, message) => {
    setAlert({
      visible: true,
      type,
      message,
    });
  };

  const handleAddCard = () => {
    // Validate card details here
    if (!cardNumber || !expiryDate || !cvv) {
      showAlert("error", "Please fill in all card details");
      return;
    }
    // API call would go here
    showAlert("success", "Card added successfully");
    // Reset form
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
  };

  const handleRewardPurchase = (rewardName, points) => {
    // API call would go here
    showAlert("success", `${rewardName} purchased successfully!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert((prev) => ({ ...prev, visible: false }))}
      />
      <ComingSoonScreen />
      {/* <ScrollView> */}
      {/* Profile Section with Gradient */}

      {/* <View style={styles.profileBackground}> */}
      {/* Back Button */}
      {/* <View style={styles.backButton}>
            <MaterialIcons name="arrow-back-ios" size={24} color="black" />
          </View>
          <View style={styles.profileHeader}>
            <Image
              source={{uri: 'https://github.com/muhammed-s.png'}}
              style={[styles.avatar, {
                borderRadius: 20
              }]}
            />
            <View style={styles.profileInfo}>
              <Text variant="headlineSmall" style={styles.nameText}>Name</Text>
              <Text variant="bodyMedium" style={styles.emailText}>Email@example.com</Text>
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Rewards Balance</Text>
                <Text style={styles.balanceAmount}>0 Points</Text>
              </View>
            </View>
          </View> */}
      {/* </View> */}

      {/* <View style={styles.settingsContainer}> */}
      {/* Payment Methods Section */}
      {/* <Card style={styles.card}>
            <List.Accordion
              title="Payment Methods"
              description="Add or manage your cards"
              left={props => <List.Icon {...props} icon="credit-card" color="#97D3FF"  style={styles.icon}/>}
              expanded={expandedPayment}
              onPress={() => setExpandedPayment(!expandedPayment)}
              style={styles.accordion}
            >
              <Card.Content style={styles.cardInputContainer}>
                <TextInput
                  label="Card Number"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  style={[styles.input, styles.inputSpacing]}
                  mode="outlined"
                  keyboardType="numeric"
                  outlineColor="#CEEAFF"
                  activeOutlineColor="#97D3FF"
                />
                <View style={styles.rowContainer}>
                  <TextInput
                    label="Expiry Date"
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                    style={[styles.input, styles.halfInput]}
                    mode="outlined"
                    placeholder="MM/YY"
                    outlineColor="#CEEAFF"
                    activeOutlineColor="#97D3FF"
                  />
                  <View style={styles.inputGap} />
                  <TextInput
                    label="CVV"
                    value={cvv}
                    onChangeText={setCvv}
                    style={[styles.input, styles.halfInput]}
                    mode="outlined"
                    keyboardType="numeric"
                    secureTextEntry
                    outlineColor="#CEEAFF"
                    activeOutlineColor="#97D3FF"
                  />
                </View>
                <Button
                  mode="contained"
                  style={styles.addCardButton}
                  onPress={handleAddCard}
                >
                  Add Card
                </Button>
              </Card.Content>
            </List.Accordion>
          </Card> */}

      {/* Rewards Section */}
      {/* <Card style={styles.card}>
            <List.Accordion
              title="Available Rewards"
              description="Purchase rewards for your users"
              left={props => <List.Icon {...props} icon="gift" color="#97D3FF" style={styles.icon}/>}
              expanded={expandedRewards}
              onPress={() => setExpandedRewards(!expandedRewards)}
              style={styles.accordion}
            >
              <Card.Content style={styles.rewardsContainer}>
                <View style={styles.rewardsContainer}>
                  {[
                    { name: 'Premium Access', points: 500, icon: 'star' },
                    { name: 'Custom Badge', points: 200, icon: 'shield-star' },
                    { name: 'Special Features', points: 1000, icon: 'crown' }
                  ].map((reward, index) => (
                    <View key={index} style={styles.rewardCard}>
                      <View style={styles.rewardInfo}>
                        <List.Icon icon={reward.icon} color="#97D3FF" style={styles.rewardIcon} />
                        <View style={styles.rewardTextContainer}>
                          <Text style={styles.rewardName}>{reward.name}</Text>
                          <Text style={styles.pointsText}>{reward.points} points</Text>
                        </View>
                      </View>
                      <Button
                        mode="contained-tonal"
                        onPress={() => handleRewardPurchase(reward.name, reward.points)}
                        style={styles.purchaseButton}
                      >
                        Purchase
                      </Button>
                    </View>
                  ))}
                </View>
              </Card.Content>
            </List.Accordion>
          </Card> */}
      {/* </View> */}
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  profileBackground: {
    paddingTop: 20,
    paddingBottom: 5,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: "rgba(206, 234, 255, 0.3)",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    borderColor: "#fff",
    width: 100,
    height: 100,
    backgroundColor: "red",
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  nameText: {
    textAlign: "right",
    color: "#000",
    fontFamily: "Figtree-Bold",
  },
  emailText: {
    textAlign: "right",
    color: "#000",
    opacity: 0.9,
    fontFamily: "Figtree-Regular",
  },
  balanceContainer: {
    marginTop: 10,
    backgroundColor: "rgba(210, 238, 255, 0.8)",
    padding: 10,
    borderRadius: 10,
  },
  balanceLabel: {
    color: "#000",
    fontSize: 12,
    textAlign: "right",
    fontFamily: "Figtree-Regular",
  },
  balanceAmount: {
    color: "#000",
    fontSize: 20,
    textAlign: "right",
    fontFamily: "Figtree-Bold",
  },
  settingsContainer: {
    padding: 12,
  },
  card: {
    marginBottom: 12,
    borderRadius: 20,
    shadowColor: "transparent",
  },
  icon: {
    marginTop: 5,
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  accordion: {
    borderRadius: 12,
    backgroundColor: "rgba(206, 234, 255, 0.8)",
  },
  cardInputContainer: {
    marginLeft: -20,
    padding: 12,
    backgroundColor: "#F8F9FA",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 40,
  },
  inputSpacing: {
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  inputGap: {
    width: 12,
  },
  halfInput: {
    flex: 1,
  },
  addCardButton: {
    marginTop: 8,
    backgroundColor: "#97D3FF",
    paddingVertical: 8,
    borderRadius: 10,
  },
  rewardsContainer: {
    paddingTop: 8,
    marginLeft: -15,
    marginRight: -2,
    gap: 8,
    backgroundColor: "#F8F9FA",
  },
  rewardCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 8,
  },
  rewardInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rewardIcon: {
    marginRight: 4,
  },
  rewardTextContainer: {
    flex: 1,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  pointsText: {
    color: "#97D3FF",
    fontWeight: "500",
  },
  purchaseButton: {
    backgroundColor: "#CEEAFF",
    marginLeft: 8,
  },
});

export default AccountSet;
