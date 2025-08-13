import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import VerifiedMarkSvg from './SVG/VerifiedMarkSvg'
import CoinSvg from './SVG/CoinSvg'
import { LinearGradient } from 'expo-linear-gradient'

const RicoinBalance = () => {
  return (
    <View style={styles.container}>
      <View style={styles.cardWrapper}>
        {/* Background color blobs */}
        <View style={[styles.colorBlob, styles.purpleBlob]} />
        <View style={[styles.colorBlob, styles.greenBlob]} />
        <View style={[styles.colorBlob, styles.yellowBlob]} />
        <View style={[styles.colorBlob, styles.grayBlob]} />
        
        {/* Glass effect overlay */}
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.5)',
            'rgba(255, 255, 255, 0.2)',
          ]}
          style={styles.glassEffect}
        >
          <View style={styles.contentWrapper}>
            <View style={styles.topRow}>
              <View style={styles.coinWrapper}>
                <CoinSvg width={48} height={48} />
              </View>
              <Text style={styles.ricoinText}>Ricoin</Text>
              <View style={styles.verifiedWrapper}>
                <VerifiedMarkSvg />
              </View>
            </View>
            <Text style={styles.currentBalanceText}>Current Balance</Text>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceAmount}>1,180</Text>
              <View style={styles.equivalentContainer}>
                <Text style={styles.equivalentText}>Equivalent</Text>
                <Text style={styles.usdAmount}>$59</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  cardWrapper: {
    height: 165,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  colorBlob: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    opacity: 0.8,
    filter: 'blur(40px)',
  },
  purpleBlob: {
    backgroundColor: '#A07DFF',
    right: -20,
    top: '50%',
    transform: [{ translateY: -64 }],
    opacity: 1,
  },
  greenBlob: {
    backgroundColor: '#91EFB7',
    left: '40%',
    bottom: -40,
    opacity: 0.85,
  },
  yellowBlob: {
    backgroundColor: '#FFBF00',
    left: -20,
    top: '50%',
    transform: [{ translateY: -64 }],
    opacity: 0.85,
  },
  grayBlob: {
    backgroundColor: '#2B5FE2',
    right: '30%',
    top: -20,
    opacity: 0.85,
  },
  glassEffect: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
  },
  contentWrapper: {
    padding: 20, 
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'flex-start', 
  },
  coinWrapper: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  ricoinText: {
    fontFamily: 'Figtree-Medium',
    fontSize: 20,
    color: '#000F1A',
    flex: 0, 
    marginTop : -10,
  },
  verifiedWrapper: {
    marginLeft: 'auto', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentBalanceText: {
    fontFamily: 'Figtree-Regular',
    fontSize: 16,
    color: 'rgba(0, 15, 26, 0.6)',
    marginTop: 12, 
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 4, 
  },
  balanceAmount: {
    fontFamily: 'Figtree-Bold',
    fontSize: 40,
    color: '#000F1A',
  },
  equivalentContainer: {
    alignItems: 'flex-end',
    minWidth: 80, 
  },
  equivalentText: {
    fontFamily: 'Figtree-Regular',
    fontSize: 14,
    color: 'rgba(0, 15, 26, 0.6)',
    marginBottom: 2, 
  },
  usdAmount: {
    fontFamily: 'Figtree-Bold',
    fontSize: 24,
    color: '#000F1A',
  },
})

export default RicoinBalance