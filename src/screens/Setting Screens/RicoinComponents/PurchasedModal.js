import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import CoinSvg from "./SVG/CoinSvg";
import DoneMarkSvg from "./SVG/DoneMarkSvg";

const PurchasedModal = ({ visible, onClose, amount }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.whiteCircle}>
              <DoneMarkSvg width={70} height={70} />
            </View>
          </View>

          {/* Rest of modal content with adjusted top margin */}
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Top Up Successful</Text>
            <Text style={styles.message}>Your top up was successful</Text>

            {/* Ricoin Amount */}
            <View style={styles.coinContainer}>
              <CoinSvg width={70} height={70} />
              <View style={styles.coinTextContainer}>
                <Text style={styles.coinText}>Ricoin</Text>
                <Text style={styles.coinAmount}>{amount || 0}</Text>
              </View>
            </View>

            {/* Added To Section */}
            <View style={styles.addedToSection}>
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.addedToText}>Added to</Text>
                <View style={styles.divider} />
              </View>

              {/* Profile Container */}
              <View style={styles.profileContainer}>
                <Image
                  source={require("../../../assets/ProfileScreenImages/Profile.jpg")}
                  style={styles.profileImage}
                />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>Sarah Anderson</Text>
                  <Text style={styles.profileHandle}>@sarahanderson</Text>
                </View>
              </View>

            </View>

            {/* Done Button */}
            <TouchableOpacity style={styles.doneButton} onPress={onClose}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    width: "90%",
    alignItems: "center",
    position: "relative",
    paddingTop: 60,
  },
  iconContainer: {
    width: 83,
    height: 83,
    borderRadius: 40,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -35,
    alignSelf: "center",
  },
  whiteCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: "Figtree-Bold",
    color: "#0167CC",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    fontFamily: "Figtree-Regular",
    color: "#808080",
    marginBottom: 24,
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  coinTextContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: 12,
    marginTop: -12,
  },
  coinAmount: {
    fontSize: 32,
    fontFamily: "Figtree-Bold",
    color: "#000",
  },
  addedToSection: {
    width: "100%",
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  addedToText: {
    marginHorizontal: 16,
    color: "#6B7280",
    fontFamily: "Figtree-Medium",
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    width: '100%',
    paddingHorizontal: 16, 
    marginBottom: 12,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  profileInfo: {
    flex: 0, 
  },
  profileName: {
    fontSize: 16,
    fontFamily: 'Figtree-Medium',
    color: '#000',
    textAlign: 'left', 
  },
  profileHandle: {
    fontSize: 14,
    fontFamily: 'Figtree-Regular',
    color: '#6B7280',
    textAlign: 'left', 
  },
  doneButton: {
    backgroundColor: "#0167CC",
    borderRadius: 8,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Figtree-Medium",
  },
});

export default PurchasedModal;
