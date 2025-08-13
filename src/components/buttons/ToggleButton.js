import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const ToggleButton = ({ isEnabled, onToggle }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggle}
      style={[styles.container, isEnabled && styles.containerEnabled]}
    >
      <View style={[styles.circle, isEnabled && styles.circleEnabled]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
    backgroundColor: '#E4E4E4',
  },
  containerEnabled: {
    backgroundColor: '#58AFFF',
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
  },
  circleEnabled: {
    transform: [{ translateX: 20 }],
  },
});

export default ToggleButton;
