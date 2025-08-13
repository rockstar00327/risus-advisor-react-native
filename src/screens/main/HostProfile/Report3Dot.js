import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  Animated,
  Dimensions
} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { Feather, MaterialIcons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const Report3Dot = ({ isVisible, onClose, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState(null);
  const [otherReason, setOtherReason] = useState('');
  const [animation] = useState(new Animated.Value(0));
  
  const reportReasons = [
    { id: 1, text: 'Inappropriate Content', icon: 'alert-circle' },
    { id: 2, text: 'Harassment or Bullying', icon: 'message-square' },
    { id: 3, text: 'False Information', icon: 'info' },
    { id: 4, text: 'Violent or Harmful Content', icon: 'slash' },
    { id: 5, text: 'Spam', icon: 'repeat' },
    { id: 6, text: 'Other', icon: 'more-horizontal' }
  ];

  React.useEffect(() => {
    if (isVisible) {
      // Animate modal sliding up
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Reset selection when modal closes
      setSelectedReason(null);
      setOtherReason('');
    }
  }, [isVisible]);

  const handleSubmit = () => {
    const reportData = {
      reason: selectedReason === 6 ? otherReason : reportReasons.find(r => r.id === selectedReason)?.text,
      timestamp: new Date().toISOString()
    };
    
    onSubmit(reportData);
    onClose();
  };

  const slideAnimation = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [height, 0],
        }),
      },
    ],
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <Animated.View style={[styles.modalContainer, slideAnimation]}>
              <View style={styles.headerContainer}>
                <View style={styles.handle} />
                <Text style={styles.headerTitle}>Report</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <Text style={styles.instructionText}>
                Please select a reason for reporting this content
              </Text>

              <ScrollView 
                style={styles.reasonsContainer}
                showsVerticalScrollIndicator={false}
              >
                {reportReasons.map((reason) => (
                  <TouchableOpacity
                    key={reason.id}
                    style={[
                      styles.reasonItem,
                      selectedReason === reason.id && styles.selectedReason
                    ]}
                    onPress={() => setSelectedReason(reason.id)}
                  >
                    <View style={styles.reasonIcon}>
                      <Feather 
                        name={reason.icon} 
                        size={20} 
                        color={selectedReason === reason.id ? "#0066CC" : "#7DC8FF"} 
                      />
                    </View>
                    <Text 
                      style={[
                        styles.reasonText,
                        selectedReason === reason.id && styles.selectedReasonText
                      ]}
                    >
                      {reason.text}
                    </Text>
                    {selectedReason === reason.id && (
                      <MaterialIcons name="check-circle" size={22} color="#0066CC" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {selectedReason === 6 && (
                <View style={styles.otherReasonContainer}>
                  <TextInput
                    style={styles.otherReasonInput}
                    placeholder="Please describe the issue..."
                    multiline
                    maxLength={250}
                    value={otherReason}
                    onChangeText={setOtherReason}
                  />
                  <Text style={styles.charCount}>{otherReason.length}/250</Text>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[
                    styles.submitButton,
                    (!selectedReason || (selectedReason === 6 && !otherReason.trim())) && styles.disabledButton
                  ]}
                  disabled={!selectedReason || (selectedReason === 6 && !otherReason.trim())}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitText}>Submit Report</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '60%',
    paddingBottom: 30,
    maxHeight: '80%',
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    position: 'relative',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Figtree-Bold',
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    padding: 5,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: 'Figtree-Regular',
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  reasonsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    backgroundColor: '#F5FAFF',
  },
  selectedReason: {
    backgroundColor: '#E6F2FF',
    borderWidth: 1,
    borderColor: '#97D3FF',
  },
  reasonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#97D3FF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  reasonText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Figtree-Medium',
    color: '#333',
  },
  selectedReasonText: {
    fontFamily: 'Figtree-Bold',
    color: '#0066CC',
  },
  otherReasonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  otherReasonInput: {
    backgroundColor: '#F5FAFF',
    borderWidth: 1,
    borderColor: '#97D3FF',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    fontFamily: 'Figtree-Regular',
  },
  charCount: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontFamily: 'Figtree-Regular',
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  submitButton: {
    backgroundColor: '#0066CC',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#0066CC',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Figtree-Bold',
  },
});

export default Report3Dot;