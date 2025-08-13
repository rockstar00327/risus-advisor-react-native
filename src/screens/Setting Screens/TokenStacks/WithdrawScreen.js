import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { Feather } from "@expo/vector-icons";
import CoinSvg from '../RicoinComponents/SVG/CoinSvg';
import CalculatorSvg from '../RicoinComponents/SVG/CalculatorSvg';
import RemainingSvg from '../RicoinComponents/SVG/RemainingSvg';
import CommissionFeeSvg from '../RicoinComponents/SVG/CommissionFeeSvg';
import WithdrawModal from '../RicoinComponents/WithdrawModal';

const WithdrawScreen = ({ navigation }) => {
  const [withdrawAmount, setWithdrawAmount] = useState('0');
  const currentBalance = 1180;
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleWithdraw = () => {
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigation.goBack();
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
        <Text style={styles.headerTitle}>Withdraw</Text>
        <TouchableOpacity onPress={() => {}}>
          <Feather name="info" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Balance Section */}
      <View style={styles.balanceContainer}>
        <Image
          source={require('../../../assets/BalanceBg.png')}
          style={styles.balanceBg}
        />
        <View style={styles.balanceContent}>
          {/* Top Row */}
          <View style={styles.balanceTopRow}>
            <View style={styles.coinRow}>
              <CoinSvg width={60} height={60} />
              <Text style={styles.ricoinText}>Ricoin</Text>
            </View>
            <View style={styles.balanceTextContainer}>
              <Text style={styles.currentBalanceLabel}>Current Balance</Text>
              <Text style={styles.balanceAmount}>{currentBalance}</Text>
            </View>
          </View>

          {/* Withdrawal Amount Label */}
          <Text style={styles.withdrawalLabel}>Withdrawal Amount</Text>
          <View style={styles.withdrawalInputContainer}>
            <TextInput
              style={styles.withdrawalInput}
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              keyboardType="numeric"
            />
            <Text style={styles.withdrawalRicoins}>Ricoins</Text>
          </View>
        </View>
      </View>

      {/* Summary Section */}
      <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryLeft}>
            <CalculatorSvg />
            <Text style={styles.summaryLabel}>Estimated Value</Text>
          </View>
          <Text style={styles.summaryValue}>$48</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryLeft}>
            <RemainingSvg />
            <Text style={styles.summaryLabel}>Remaining</Text>
          </View>
          <View style={styles.remainingValue}>
            <CoinSvg width={25} height={25} />
            <Text style={[styles.summaryValue,{marginTop : -5}]}>180</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryLeft}>
            <CommissionFeeSvg />
            <Text style={styles.summaryLabel}>Commission Fee</Text>
          </View>
          <Text style={styles.summaryValue}>$2</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
          <Text style={styles.withdrawButtonText}>Create Request for Withdraw</Text>
        </TouchableOpacity>

        <Text style={styles.securityText}>
          Your payment is secured with 256-bit SSL encryption.{'\n'}
          Cash will be added to your account instantly after successful payment.
        </Text>

        <View style={styles.footerLinks}>
          <Text style={styles.link}>Terms</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.link}>Privacy</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.link}>Support</Text>
        </View>
      </View>

      <WithdrawModal 
        visible={showSuccessModal}
        onClose={handleCloseModal}
        amount="0.00"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Figtree-Medium',
    color: '#000',
  },
  backButton: {
    padding: 8,
  },
  balanceContainer: {
    height: 205,
    margin: 16,
    position: 'relative',
  },
  balanceBg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 24,
  },
  balanceContent: {
    padding: 24,
  },
  balanceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10, 
  },
  coinRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ricoinText: {
    fontSize: 20,
    fontFamily: 'Figtree-Medium',
    color: '#000',
    marginTop: -10,
  },
  balanceTextContainer: {
    alignItems: 'flex-end',
  },
  currentBalanceLabel: {
    fontSize: 14,
    fontFamily: 'Figtree-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 40,
    fontFamily: 'Figtree-Bold',
    color: '#000',
  },
  withdrawalLabel: {
    fontSize: 16,
    fontFamily: 'Figtree-Medium',
    color: '#000',
    marginBottom: 16,
  },
  withdrawalInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  withdrawalInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Figtree-Medium',
    color: '#000',
  },
  withdrawalRicoins: {
    fontSize: 14,
    fontFamily: 'Figtree-Regular',
    color: '#6B7280',
  },
  summarySection: {
    padding: 16,
    gap: 16,
    marginHorizontal : 10
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: 'Figtree-Regular',
    color: '#000',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Figtree-Medium',
    color: '#000',
  },
  remainingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footer: {
    padding: 16,
    marginTop: 'auto',
    marginHorizontal : 10,
    marginBottom : 10
  },
  withdrawButton: {
    backgroundColor: '#0167CC',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Figtree-Medium',
  },
  securityText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 10,
    fontFamily: 'Figtree-Regular',
    marginBottom: 16,
    lineHeight: 18,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  link: {
    color: '#6B7280',
    fontSize: 12,
    fontFamily: 'Figtree-Regular',
  },
  dot: {
    color: '#6B7280',
  },
});

export default WithdrawScreen;