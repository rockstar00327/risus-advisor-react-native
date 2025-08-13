import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import StripeSvg from "../RicoinComponents/SVG/StripeSvg";
import CoinSvg from "../RicoinComponents/SVG/CoinSvg";
import PurchasedSvg from "../RicoinComponents/SVG/PurchasedSvg";
import BackButton from "../../../components/buttons/BackButton";
import { Feather } from "@expo/vector-icons";
import PayPalSvg from "../RicoinComponents/SVG/PayPalSvg";
import BinanceSvg from "../RicoinComponents/SVG/BinanceSvg";
import PurchasedModal from '../RicoinComponents/PurchasedModal';

const TopUpScreen = ({ navigation }) => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const tokenAmounts = [
    { amount: 100, price: 11 },
    { amount: 500, price: 55 },
    { amount: 1000, price: 110 },
    { amount: 1500, price: 165 },
    { amount: 2500, price: 275 },
  ];

  const handleAmountSelect = (amount) => {
    if (amount === "custom") {
      setShowCustomInput(true);
      setSelectedAmount(null);
    } else {
      setShowCustomInput(false);
      setSelectedAmount(amount);
    }
  };

  const handlePurchase = () => {
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigation.goBack(); // Optional: navigate back after successful purchase
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Top Up</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Top Balance Section */}
          <View style={styles.balanceContainer}>
            <Image
              source={require("../../../assets/BalanceBg.png")}
              style={styles.balanceBg}
            />
            <View style={styles.balanceContent}>
              <View style={styles.balanceRow}>
                <CoinSvg />
                <Text style={styles.ricoinText}>Ricoin</Text>
              </View>
              <View style={styles.balanceNum}>
                <Text style={styles.currentBalance}>Current Balance</Text>
                <Text style={styles.balanceAmount}>1,180</Text>
              </View>
            </View>
          </View>

          {/* Select Amount Section */}
          <Text style={styles.selectText}>Select Amount</Text>

          {/* Token Amount Options */}
          <View style={styles.tokenGrid}>
            {tokenAmounts.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tokenOption,
                  selectedAmount === item.amount && styles.selectedTokenOption,
                ]}
                onPress={() => handleAmountSelect(item.amount)}
              >
                <CoinSvg width={35} height={35} />
                <View style={styles.tokenAmountContainer}>

                <Text
                  style={[
                    styles.tokenAmount,
                    selectedAmount === item.amount && styles.selectedTokenText,
                  ]}
                >
                  {item.amount}
                </Text>
                <Text
                  style={[
                    styles.tokenPrice,
                    selectedAmount === item.amount && styles.selectedTokenText,
                  ]}
                >
                  ${item.price}
                </Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.tokenOption,
                showCustomInput && styles.selectedTokenOption,
                styles.customTokenOption,
              ]}
              onPress={() => handleAmountSelect("custom")}
            >
              <Text
                style={[
                  styles.customText,
                  showCustomInput && styles.selectedTokenText,
                ]}
              >
                Custom
              </Text>
            </TouchableOpacity>
          </View>

          {/* Custom Amount Input */}
          {showCustomInput && (
            <View style={styles.customAmountContainer}>
              <Text style={styles.customAmountLabel}>Custom Amount</Text>
              <View style={styles.customInputWrapper}>
                <TextInput
                  style={styles.customAmountInput}
                  placeholder="Enter amount"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={customAmount}
                  onChangeText={setCustomAmount}
                />
                <Text style={styles.tokenLabel}>Tokens</Text>
              </View>
            </View>
          )}

          {/* Purchase Summary */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Purchase Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ricoins</Text>
              <Text style={styles.summaryValue}>
                {showCustomInput ? customAmount || '0' : selectedAmount || '0'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Rate</Text>
              <Text style={styles.summaryValue}>$0.10 per Ricoin</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                ${((showCustomInput ? Number(customAmount) : selectedAmount || 0) * 0.10).toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Processing Fee</Text>
              <Text style={styles.summaryValue}>$2.50</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>
                ${((showCustomInput ? Number(customAmount) : selectedAmount || 0) * 0.10 + 2.50).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Payment Methods */}
          <Text style={styles.paymentTitle}>Payment method</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity style={[styles.paymentOption, styles.activePaymentOption]}>
              <StripeSvg width={40} height={40} />
              <Text style={styles.paymentText}>Stripe</Text>
              <Text style={styles.paymentAmount}>
                ${((showCustomInput ? Number(customAmount) : selectedAmount || 0) * 0.10 + 2.50).toFixed(2)}
              </Text>
              <View style={styles.radioContainer}>
                <View style={styles.radioOuter}>
                  <View style={styles.radioInner} />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.paymentOption, styles.disabledPaymentOption]} 
              disabled={true}
            >
              <PayPalSvg width={40} height={40} />
              <Text style={styles.paymentText}>PayPal</Text>
              <Text style={styles.comingSoon}>Coming soon</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.paymentOption, styles.disabledPaymentOption]}
              disabled={true}
            >
              <BinanceSvg width={40} height={40} />
              <Text style={styles.paymentText}>Binance</Text>
              <Text style={styles.comingSoon}>Coming soon</Text>
            </TouchableOpacity>
          </View>

          {/* Purchase Button */}
          <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
            <View style={styles.purchaseButtonContent}>
              <PurchasedSvg width={24} height={24} />
              <Text style={styles.purchaseText}>Purchase</Text>
            </View>
          </TouchableOpacity>

          {/* Add Success Modal */}
          <PurchasedModal 
            visible={showSuccessModal}
            onClose={handleCloseModal}
            amount={showCustomInput ? customAmount : selectedAmount}
          />

          {/* Footer Text */}
          <Text style={styles.footerText}>
            Your payment is secured with 256-bit SSL encryption.{"\n"}
            All payments are processed securely and automatically.
          </Text>

          {/* Footer Links */}
          <View style={styles.footerLinks}>
            <Text style={styles.link}>Terms</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.link}>Privacy</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.link}>Support</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Figtree-Medium",
    color: "#000000",
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  balanceContainer: {
    height: 110,
    marginBottom: 24,
    position: "relative",
  },
  balanceBg: {
    width: "100%",
    height: "100%",
    position: "absolute",
    borderRadius: 12,
  },
  balanceContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: 50,
  },
  ricoinText: {
    color: "#00000",
    fontSize: 20,
    fontFamily: "Figtree-Medium",
    marginTop: -10,
  },
  balanceNum: {
    flexDirection: "column",
  },
  balanceAmount: {
    color: "#000000",
    fontSize: 35,
    fontFamily: "Figtree-Bold",
    marginTop: 4,
  },
  currentBalance: {
    color: "#5B5B5B",
    fontSize: 12,
    fontFamily: "Figtree-Medium",
  },
  selectText: {
    fontSize: 16,
    fontFamily: "Figtree-Medium",
    marginBottom: 16,
  },
  tokenGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tokenOption: {
    width: "30%",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    flexDirection: "row",
  },
  tokenAmountContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  tokenAmount: {
    fontSize: 16,
    fontFamily: "Figtree-Medium",
  },
  tokenPrice: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Figtree-Regular",
  },
  customText: {
    fontSize: 16,
    fontFamily: "Figtree-Medium",
    color: "#000000",
  },
  customAmountContainer: {
    marginBottom: 24,
    backgroundColor: '#9BD4FF40',
    padding: 16,
    borderRadius: 8,
  },
  customAmountLabel: {
    fontSize: 16,
    color: '#000',
    marginBottom: 12,
    fontFamily: 'Figtree-Medium',
  },
  customInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customAmountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
    fontFamily: 'Figtree-Regular',
  },
  tokenLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Figtree-Regular',
  },
  summaryContainer: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily : "Figtree-Medium",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    color: "#6B7280",
    fontFamily : "Figtree-Regular",
  },
  summaryValue: {
    fontFamily : "Figtree-Medium",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily : "Figtree-Medium",
  },
  totalAmount: {
    fontSize: 16,
    fontFamily : "Figtree-Medium",
    color: "#2563EB",
  },
  paymentTitle: {
    fontSize: 16,
    fontFamily: "Figtree-Medium",
    marginBottom: 16,
  },
  paymentOptions: {
    marginBottom: 24,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  selectedPayment: {
    borderColor: "#2563EB",
    backgroundColor: "#F3F4F6",
  },
  paymentText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily : "Figtree-Medium",
    flex: 1,
  },
  paymentAmount: {
    color: '#2563EB',
    fontFamily : "Figtree-Medium",
    marginRight: 30,
  },
  comingSoon: {
    color: "#000000",
    fontSize: 14,
    fontFamily : "Figtree-Medium",
  },
  binanceIcon: {
    width: 40,
    height: 40,
  },
  purchaseButton: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  purchaseButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  purchaseText: {
    color: "#fff",
    fontSize: 16,
    fontFamily : "Figtree-Medium",
  },
  footerText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 12,
    marginBottom: 16,
    lineHeight: 18,
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: "#6B7280",
    fontSize: 12,
  },
  dot: {
    color: "#6B7280",
    marginHorizontal: 8,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  selectedTokenOption: {
    backgroundColor: "#0167CC",
    borderColor: "#0167CC",
  },
  selectedTokenText: {
    color: "#FFFFFF",
  },
  radioContainer: {
    position: 'absolute',
    right: 16,
    marginLeft: 10
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0167CC",
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#0167CC",
  },
  customTokenOption: {
    justifyContent: "center", 
  },
  disabledPaymentOption: {
    backgroundColor: "#0000001A",
    borderRadius: 8,
    opacity: 0.8,
  },
  activePaymentOption: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
});

export default TopUpScreen;
