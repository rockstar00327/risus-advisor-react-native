
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";

const WhoCanSee = ({ visible, onClose, onSelect, currentValue }) => {
  const options = [
    { id: 'everyone', label: 'Everyone', icon: 'globe-outline' },
    { id: 'followers', label: 'Followers', icon: 'people-outline' },
    { id: 'private', label: 'Only me', icon: 'lock-closed-outline' }
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Who can see this?</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionRow,
                currentValue === option.id && styles.selectedOption
              ]}
              onPress={() => {
                onSelect(option.id);
                onClose();
              }}
            >
              <View style={styles.optionLeft}>
                <Ionicons name={option.icon} size={24} color="#000" />
                <Text style={styles.optionText}>{option.label}</Text>
              </View>
              {currentValue === option.id && (
                <Ionicons name="checkmark" size={24} color="#0066CC" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    //backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    minHeight: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Figtree-Bold',
  },
  closeButton: {
    padding: 4,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Figtree-Regular',
  },
  selectedOption: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
});

export default WhoCanSee;