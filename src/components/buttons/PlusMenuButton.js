import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PlusMenuButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();
  const animation = new Animated.Value(0);

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
    }).start();
    setIsOpen(!isOpen);
  };

  const createDocStyle = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -100],
        }),
      },
    ],
  };

  // Add similar styles for other buttons

  return (
    <View style={styles.container}>
      {isOpen && (
        <>
          <Animated.View style={[styles.menuItem, createDocStyle]}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('CreateDoc')}
              style={styles.button}
            >
              {/* Add Icon for Create Doc */}
            </TouchableOpacity>
          </Animated.View>
          {/* Add other menu items similarly */}
        </>
      )}
      <TouchableOpacity onPress={toggleMenu} style={styles.plusButton}>
        {/* Plus Icon */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
  },
  plusButton: {
    // style your plus button
  },
  menuItem: {
    position: 'absolute',
    // style your menu items
  },
});

export default PlusMenuButton;
