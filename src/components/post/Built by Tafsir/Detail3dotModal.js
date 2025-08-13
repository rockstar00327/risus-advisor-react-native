import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Detail3dotModal = ({
  visible,
  onClose,
  onReport,
  onShare,
  onSave,
  onHide,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.option} onPress={onReport}>
            <MaterialCommunityIcons
              name="flag-outline"
              size={24}
              color="#FF3B30"
            />
            <Text style={styles.optionText}>Report Contribution</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={onShare}>
            <MaterialCommunityIcons
              name="share-outline"
              size={24}
              color="#007AFF"
            />
            <Text style={styles.optionText}>Share Contribution</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={onSave}>
            <MaterialCommunityIcons
              name="bookmark-outline"
              size={24}
              color="#007AFF"
            />
            <Text style={styles.optionText}>Bookmark</Text>
          </TouchableOpacity>
          {/*           
          <TouchableOpacity style={styles.option} onPress={onHide}>
            <MaterialCommunityIcons name="eye-off-outline" size={24} color="#007AFF" />
            <Text style={styles.optionText}>Hide Contribution</Text>
          </TouchableOpacity> */}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  optionText: {
    marginLeft: 16,
    fontSize: 16,
    color: "#333",
    fontFamily: "Figtree-Regular",
  },
});

export default Detail3dotModal;
