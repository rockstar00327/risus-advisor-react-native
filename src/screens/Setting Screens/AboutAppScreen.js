import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground , Platform, StatusBar} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const AboutAppScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground 
      source={require('../../assets/Background/welcome-bg.png')}
      style={styles.container}
    >
      <View style={styles.contentContainer}>

        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back-ios" size={24} color="#000" />
        </TouchableOpacity>
        <Image 
          source={require('../../../assets/icon.png')}  
          style={styles.appIcon}
        />
        <Text style={styles.appName}>Risus</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.description}>
          A dynamic platform where ideas thrive submit, vote, and get rewarded
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Developed by<Text style={{fontFamily: 'Figtree-Medium' , color: '#000'}}> NexCodeix</Text></Text>
          <Text style={styles.copyright}>&copy; {new Date().getFullYear()} <Text style={{fontFamily: 'Figtree-Medium' , color: '#000'}}>Risus</Text></Text>
        </View>
      </View>



    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  appIcon: {
    width: 95,
    height: 100,
   //borderRadius: 20,
    marginBottom: 20,
  },
  appName: {
    fontSize: 35,
    fontFamily: 'Briem-Medium',
    color: '#7DC8FF',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    fontFamily: 'Figtree-Regular',
    color: '#666666',
    marginBottom: 24,
  },
  divider: {
    width: '60%',
    height: 1.5,
    backgroundColor: 'rgba(158, 158, 158, 0.52)',
    marginVertical: 24,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Figtree-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '80%',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'Figtree-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  copyright: {
    fontSize: 14, 
    fontFamily: 'Figtree-Medium',
    color : "#666666"

  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Figtree-Medium',
    color: '#666666',
  },
})

export default AboutAppScreen