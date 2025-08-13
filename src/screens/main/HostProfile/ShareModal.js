import React from 'react';
import { Share, Platform, Alert } from 'react-native';

// Function to handle native sharing
export const shareContent = async (postData) => {
  try {
    // Extract relevant data from the post
    const { title, content, url } = postData;
    
    // Create the message to share
    const shareMessage = content || "Check out this post!";
    const shareTitle = title || "Share this post";
    const shareUrl = url || "https://yourdomain.com/posts/" + postData.id;
    
    // Configure share options
    const shareOptions = {
      message: Platform.OS === 'ios' ? undefined : shareMessage,
      title: shareTitle,
      url: shareUrl,
      subject: shareTitle // For email sharing
    };
    
    // Show the native share dialog
    const result = await Share.share(shareOptions);
    
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // Shared with activity type of result.activityType
        console.log(`Shared via ${result.activityType}`);
      } else {
        // Shared
        console.log('Shared successfully');
      }
    } else if (result.action === Share.dismissedAction) {
      // Dismissed
      console.log('Share dismissed');
    }
    
    return result;
  } catch (error) {
    Alert.alert('Error', 'Something went wrong sharing the post');
    console.error('Error sharing:', error);
  }
};
