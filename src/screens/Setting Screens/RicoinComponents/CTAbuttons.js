import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const CTAbuttons = () => {
  const navigation = useNavigation()

  const handleBuyPress = () => {
    navigation.navigate('TopUpScreen')
  }
  const handleWithdrawPress = () => {
    navigation.navigate('WithdrawScreen')
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.buyButton}
        onPress={handleBuyPress}
      >
        <Text style={styles.buyButtonText}>Buy Ricoins</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdrawPress}>
        <Text style={styles.withdrawButtonText}>Withdraw</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  buyButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#0167CC',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  withdrawButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Figtree-SemiBold',
    fontSize: 16,
  },
  withdrawButtonText: {
    color: '#000F1A',
    fontFamily: 'Figtree-SemiBold',
    fontSize: 16,
  },
})

export default CTAbuttons