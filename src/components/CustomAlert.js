import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 

const CustomAlert = ({ type, message, visible, onClose }) => {
  const alertStyles = {
    success: { 
      backgroundColor: 'rgba(107, 255, 123, 1)',
      icon: 'check-circle', // Icon name for success
      shadowColor: '#22bb33'
    },
    warning: { 
      backgroundColor: '#ffb84ff7',
      icon: 'warning', // Icon name for warning
      shadowColor: '#ffb84ff7'
    },
    error: { 
      backgroundColor: 'rgba(255, 51, 51, 1)',
      icon: 'error', // Icon name for error
      width: '100%',
      height: '100%',
      shadowColor: 'rgba(255, 51, 51, 0.8)'
    },
  };

  const { backgroundColor, icon, shadowColor } = alertStyles[type] || alertStyles.success;

  const [positionAnim] = useState(new Animated.Value(-100));
  const [opacityAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Slide down and fade in
      Animated.parallel([
        Animated.spring(positionAnim, {
          toValue: 50,
          tension: 50,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide after 3 seconds 
      const timer = setTimeout(() => {
        hideAlert();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideAlert = () => {
    Animated.parallel([
      Animated.timing(positionAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onClose && onClose());
  };

  return (
    <Animated.View 
      style={[ 
        styles.alertContainer, 
        { 
          backgroundColor, 
          transform: [{ translateY: positionAnim }], 
          opacity: opacityAnim, 
          shadowColor: shadowColor 
        }
      ]}
    >
      <View style={styles.contentWrapper}>
        <View style={styles.iconContainer}> 
          <MaterialIcons name={icon} size={20} color="black" /> 
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    top: 40,
    left: '4%',
    right: '4%',
    zIndex: 1000,
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  messageContainer: {
    flex: 1,
  },
  message: {
    fontSize: 15,
    color: 'black',
    fontWeight: '400',
    letterSpacing: 0.3,
  },
});

export default CustomAlert;
