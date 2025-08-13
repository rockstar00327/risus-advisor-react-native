import { Share, Alert } from 'react-native'

// Convert this to a simple function that can be called directly
const shareContent = async (shareLink, contentTitle) => {
  try {
    const shareMessage = `Check out this ${contentTitle || 'content'}: ${shareLink || 'https://yourapp.com/content'}`;
    await Share.share({
      message: shareMessage,
      url: shareLink, // iOS only
      title: `Share this ${contentTitle || 'content'}` // Android only
    });
    return true;
  } catch (error) {
    Alert.alert('Error', 'Failed to share content');
    return false;
  }
}

export default shareContent;