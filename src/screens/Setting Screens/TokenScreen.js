import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, Image } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import RicoinBalance from './RicoinComponents/RicoinBalance'
import CTAbuttons from './RicoinComponents/CTAbuttons'
import TransactionHistory from './RicoinComponents/TransactionHistory'

const TokenScreen = () => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <Image 
          source={require('../../assets/ProfileScreenImages/Profile.jpg')}
          style={styles.profileImage}
        />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <RicoinBalance />
        <CTAbuttons />
        <TransactionHistory />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Figtree-Medium',
    color: '#000F1A',
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  content: {
    flex: 1,
  },
})

export default TokenScreen