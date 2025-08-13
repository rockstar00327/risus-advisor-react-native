import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import CommentModal from '../CommentModal/CommentModal';

const PostAction = ({ likes, comments }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLikePress = () => {
    setIsLiked(!isLiked);
  };

  return (
    <View style={styles.actions}>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleLikePress}
        >
          {isLiked ? (
            <AntDesign name="heart" size={20} color="#9BD4FF" />
          ) : (
            <Feather name="heart" size={20} color="#666" />
          )}
          <Text style={styles.actionText}>{likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowComments(true)}
        >
          <Feather name="message-circle" size={20} color="#666" />
          <Text style={styles.actionText}>{comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Feather name="send" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <CommentModal 
        visible={showComments}
        onClose={() => setShowComments(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    padding: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    color: '#666',
    fontSize: 14,
  }
});

export default PostAction;
