import { View, Text, Modal, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import DoneMarkSvg from './SVG/DoneMarkSvg';

const WithdrawModal = ({ visible, onClose, amount, date = "June 9, 2025", time = "12:35" }) => {
  const referenceNumber = "ALKS-9928-HGJD-1134";

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
        
          <View style={styles.iconContainer}>
            <View style={styles.whiteCircle}>
              <DoneMarkSvg width={70} height={70} />
            </View>
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Success Message */}
            <Text style={styles.title}>Withdraw Successful</Text>
            <Text style={styles.message}>Your withdrawal was successful</Text>

            {/* Amount */}
            <Text style={styles.amount}>${amount || "0.00"}</Text>

            {/* Sent To Section */}
            <View style={styles.sentToSection}>
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.sentToText}>Sent to</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.profileContainer}>
                <Image 
                  source={require('../../../assets/ProfileScreenImages/Profile.jpg')}
                  style={styles.profileImage}
                />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>Sarah Anderson</Text>
                  <Text style={styles.cardNumber}>***** **** 80901</Text>
                </View>
              </View>
            </View>

            {/* Transaction Details */}
            <View style={styles.transactionSection}>
              <Text style={styles.sectionTitle}>Transaction Details</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment</Text>
                <Text style={styles.detailValue}>${amount || "0.00"}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{date}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{time}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Reference Number</Text>
                <Text style={styles.detailValue}>{referenceNumber}</Text>
              </View>

              <View style={[styles.detailRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Payment</Text>
                <Text style={styles.totalAmount}>${amount || "0.00"}</Text>
              </View>
            </View>

            {/* Done Button */}
            <TouchableOpacity style={styles.doneButton} onPress={onClose}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    width: '90%',
    alignItems: 'center',
    position: 'relative',
    maxHeight: '85%', // Limit height on smaller screens
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60, // Space for the icon
    alignItems: 'center',
  },
  iconContainer: {
    width: 83,
    height: 83,
    borderRadius: 42,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -41,
    zIndex: 1, // Ensure icon stays on top
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  whiteCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Figtree-Bold',
    color: '#0167CC',
    marginBottom: 8,
  },
  message: {
    fontSize: 14, 
    fontFamily: 'Figtree-Regular',
    color: '#808080',
    marginBottom: 24,
  },
  amount: {
    fontSize: 30,
    fontFamily: 'Figtree-Bold',
    color: '#000',
    marginBottom: 24,
  },
  sentToSection: {
    width: '100%',
    marginBottom: 32,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  sentToText: {
    marginHorizontal: 16,
    color: '#6B7280',
    fontFamily: 'Figtree-Medium',
    fontSize: 14, // Added size
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the content
    width: '100%',
    paddingHorizontal: 24,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  profileInfo: {
    flex: 0, // Remove flex to prevent stretching
    alignItems: 'flex-start', // Align text to left
  },
  profileName: {
    fontSize: 14, // Reduced from 16
    fontFamily: 'Figtree-Medium',
    color: '#000',
  },
  cardNumber: {
    fontSize: 12, // Reduced from 14
    fontFamily: 'Figtree-Regular',
    color: '#6B7280',
  },
  transactionSection: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16, // Reduced from 18
    fontFamily: 'Figtree-Medium',
    color: '#000',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12, // Reduced from 14
    fontFamily: 'Figtree-Regular',
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 12, // Reduced from 14
    fontFamily: 'Figtree-Medium',
    color: '#000',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 14, // Reduced from 16
    fontFamily: 'Figtree-Medium',
    color: '#0167CC',
  },
  totalAmount: {
    fontSize: 14, // Reduced from 16
    fontFamily: 'Figtree-Bold',
    color: '#0167CC',
  },
  doneButton: {
    backgroundColor: '#0167CC',
    borderRadius: 8,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 14, // Reduced from 16
    fontFamily: 'Figtree-Medium',
  },
});

export default WithdrawModal;