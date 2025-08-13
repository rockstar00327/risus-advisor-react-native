import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import ShareModal from './ShareModal';

const ShareModalScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { postContent } = route.params || {};
  
  return (
    <ShareModal
      visible={true}
      onClose={() => navigation.goBack()}
      postContent={postContent || "Check out this post!"}
    />
  );
};

export default ShareModalScreen;
