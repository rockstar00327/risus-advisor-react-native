import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const data = [
  {
    id: 1,
    name: 'Wan',
    username: '@wan',
    userAvatar: require('../../assets/ProfileScreenImages/Profile.jpg'),
    image: require('../../assets/images/post1.jpg'),
    title: 'Beautiful Architecture',
    likes: '5.2k',
    comments: '320'
  },
  {
    id: 2,
    name: 'Re',
    username: '@re',
    userAvatar: require('../../assets/ProfileScreenImages/Profile.jpg'),
    image: require('../../assets/images/post2.jpg'),
    title: 'Modern Design',
    likes: '3.1k',
    comments: '156'
  }
];

const Repost = ({ position = 'left', onPress, isActive }) => {
  const post = position === 'left' ? data[0] : data[1];

  return (
    <TouchableOpacity 
      style={[
        styles.repostContainer,
        isActive && styles.activeRepost
      ]}
      onPress={() => onPress?.(post)}
    >
      <View style={styles.miniPost}>
        <Image 
          source={post.image}
          style={styles.postImage}
        />
        <BlurView intensity={20} style={styles.overlay}>
          <Image 
            source={post.userAvatar}
            style={styles.avatar}
          />
          <Text style={styles.username} numberOfLines={1}>{post.username}</Text>
        </BlurView>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  repostContainer: {
    width: '100%',
    height: '100%',
    padding: 10,
    opacity: 0.9,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  activeRepost: {
    opacity: 1,
    transform: [{scale: 1.05}],
  },
  miniPost: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
    borderRadius: 8,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  username: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default Repost;
