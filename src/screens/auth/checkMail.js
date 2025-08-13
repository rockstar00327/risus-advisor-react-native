import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons' 

const CheckMail = ({ navigation }) => {
  return (
    <ImageBackground 
      source={require('../../assets/Background/welcome-bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Ionicons name="mail-outline" size={60} color="#7DC8FF" />
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.description}>
            We have sent a verification link to your email address. Please check your inbox and follow the instructions to verify your account.
          </Text>
          <Text style={styles.subText}>
            Didn't receive the email? Check your spam folder or{' '}
            <TouchableOpacity 
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.resendLink}
            >
              <Text style={styles.resendLink}>Resend Email</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Figtree-Bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 15,
    marginBottom: 40,
    lineHeight: 24,
    fontFamily: 'Figtree-Regular',
  },
  subText: {
    fontSize: 15,
    color: '#000',
    lineHeight: 30,
    textAlign: 'center',
    fontFamily: 'Figtree-Regular',
  },
  resendLink: {
    color: '#7DC8FF',
    fontFamily: 'Figtree-Medium',
    fontSize: 18,
  },
})

export default CheckMail