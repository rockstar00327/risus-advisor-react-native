import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CustomAlert from '../../components/CustomAlert';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState({
    visible: false,
    type: '',
    message: ''
  });

  const handleProceed = () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      setAlert({
        visible: true,
        type: 'error',
        message: 'Please enter your email address'
      });
      return;
    }

    if (!emailRegex.test(email)) {
      setAlert({
        visible: true,
        type: 'error',
        message: 'Please enter a valid email address'
      });
      return;
    }

    // If validation passes, navigate to checkMail screen
    navigation.navigate('checkMail');
  };

  return (
    <View style={styles.container}>
      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert(prev => ({ ...prev, visible: false }))}
      />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Forget Password</Text>
        <View style={styles.placeholder} />
      </View>
      <Text style={styles.headerText}>
        Please enter your mail to send the OTP
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email address</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      

      <TouchableOpacity style={styles.sendButton} onPress={handleProceed}>
        <Text style={styles.sendButtonText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Figtree-Bold',
  },
  placeholder: {
    width: 40, 
  },
  headerText: {
    fontSize: 16,
    fontFamily: 'Figtree-Regular',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
    backgroundColor: '#F5F8FF',
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Figtree-Medium',
    color: '#737373',
    marginBottom: 13, 
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2196F3',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: 'Figtree-Regular',
    color: '#333',
  },
  tryAnotherWay: {
    color: '#000',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 20,
  },
  sendButton: {
    backgroundColor: '#CEEAFF',
    padding: 15,
    width: '80%',
    borderRadius: 20,
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  sendButtonText: {
    color: '#000',
    fontSize: 17.5,
    fontFamily: 'Figtree-Bold',
  },
});

export default ForgotPasswordScreen;
