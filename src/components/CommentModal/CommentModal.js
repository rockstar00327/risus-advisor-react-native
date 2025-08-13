import React from 'react';
import { useNavigation } from '@react-navigation/native';

const CommentModal = ({ visible, onClose }) => {
  const navigation = useNavigation();
  
  // If visible is true, navigate to the CommentModalScreen
  React.useEffect(() => {
    if (visible) {
      navigation.navigate('CommentModal');
      // Call onClose to reset the visible state in the parent component
      if (onClose) onClose();
    }
  }, [visible, navigation, onClose]);

  // This component doesn't render anything visible
  return null;
};

export default CommentModal;
