import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  Linking,
  Alert,
  Clipboard,
  Share,
  Animated
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';

// Social Media Platforms for sharing
const socialPlatforms = [
  {
    id: 1,
    name: 'Messenger',
    icon: 'facebook-messenger',
    iconType: 'FontAwesome5',
    color: '#0084FF',
    action: (content, comment, showToast) => {
      const message = comment ? `${comment}\n\n${content}` : content;
      
      // Use React Native's built-in Share API first to try native sharing
      Share.share({
        message: message,
        title: 'Share via Messenger',
      }, {
        dialogTitle: 'Share via Messenger',
        subject: 'Share via Messenger',
        // Specify we want to share via Messenger if possible
        tintColor: '#0084FF',
        excludedActivityTypes: [
          'com.apple.UIKit.activity.PostToTwitter',
          'com.apple.UIKit.activity.PostToFacebook',
          'com.apple.UIKit.activity.PostToWeibo',
          'com.apple.UIKit.activity.Print',
          'com.apple.UIKit.activity.CopyToPasteboard',
          'com.apple.UIKit.activity.AssignToContact',
          'com.apple.UIKit.activity.SaveToCameraRoll',
          'com.apple.UIKit.activity.AddToReadingList',
          'com.apple.UIKit.activity.PostToFlickr',
          'com.apple.UIKit.activity.PostToVimeo',
          'com.apple.UIKit.activity.PostToTencentWeibo',
          'com.apple.UIKit.activity.AirDrop',
          'com.apple.UIKit.activity.OpenInIBooks',
          'com.apple.UIKit.activity.MarkupAsPDF',
          'com.apple.reminders.RemindersEditorExtension',
          // Don't exclude messenger
          // 'com.facebook.Messenger.ShareExtension', 
        ]
      }).catch(() => {
        // If Share API fails, attempt direct deep linking
        Linking.canOpenURL('fb-messenger://').then(supported => {
          if (supported) {
            Linking.openURL('fb-messenger://');
            Clipboard.setString(message);
            showToast('Message copied for sharing!');
          } else {
            // Fallback to the native share dialog
            Share.share({
              message: message,
            });
          }
        });
      });
    }
  },
  {
    id: 2,
    name: 'Twitter',
    icon: 'twitter',
    iconType: 'FontAwesome',
    color: '#1DA1F2',
    action: (content, comment, showToast) => {
      const message = comment ? `${comment}\n\n${content}` : content;
      
      // Use the native share dialog targeting Twitter
      Share.share({
        message: message,
        title: 'Share to Twitter',
      }, {
        dialogTitle: 'Share to Twitter',
        subject: 'Share to Twitter',
        // Specify we want to share via Twitter if possible
        tintColor: '#1DA1F2',
        excludedActivityTypes: [
          'com.apple.UIKit.activity.PostToFacebook',
          'com.apple.UIKit.activity.PostToWeibo',
          'com.apple.UIKit.activity.Print',
          'com.apple.UIKit.activity.CopyToPasteboard',
          'com.apple.UIKit.activity.AssignToContact',
          'com.apple.UIKit.activity.SaveToCameraRoll',
          'com.apple.UIKit.activity.AddToReadingList',
          'com.apple.UIKit.activity.PostToFlickr',
          'com.apple.UIKit.activity.PostToVimeo',
          'com.apple.UIKit.activity.PostToTencentWeibo',
          'com.apple.UIKit.activity.AirDrop',
          'com.apple.UIKit.activity.OpenInIBooks',
          'com.apple.UIKit.activity.MarkupAsPDF',
          'com.apple.reminders.RemindersEditorExtension',
          'com.facebook.Messenger.ShareExtension',
          // Don't exclude Twitter
          // 'com.apple.UIKit.activity.PostToTwitter',
        ]
      }).catch(() => {
        // Fallback to web intent URL if native sharing fails
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
        Linking.canOpenURL(twitterUrl).then(supported => {
          if (supported) {
            Linking.openURL(twitterUrl);
          } else {
            Share.share({ message: message });
          }
        });
      });
    }
  },
  {
    id: 3,
    name: 'Instagram',
    icon: 'instagram',
    iconType: 'FontAwesome',
    color: '#C13584',
    action: (content, comment, showToast) => {
      const message = comment ? `${comment}\n\n${content}` : content;
      
      // Use the native share dialog
      Share.share({
        message: message,
        title: 'Share to Instagram',
      }, {
        dialogTitle: 'Share to Instagram',
        subject: 'Share to Instagram'
      }).catch(() => {
        // Instagram has limited sharing capabilities via deep links
        // Try to open the app at least
        Clipboard.setString(message);
        Linking.canOpenURL('instagram://').then(supported => {
          if (supported) {
            Linking.openURL('instagram://');
            Clipboard.setString(message);
            showToast('Content copied to clipboard for sharing on Instagram.');
          } else {
            Alert.alert('Instagram Not Installed', 'Instagram app is not installed. Your message has been copied to clipboard.');
          }
        });
      });
    }
  },
  {
    id: 4,
    name: 'WhatsApp',
    icon: 'whatsapp',
    iconType: 'FontAwesome',
    color: '#25D366',
    action: (content, comment, showToast) => {
      const message = comment ? `${comment}\n\n${content}` : content;
      // WhatsApp deep linking works well
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
      
      Linking.canOpenURL(whatsappUrl).then(supported => {
        if (supported) {
          Linking.openURL(whatsappUrl);
        } else {
          // Fallback to native share dialog
          Share.share({
            message: message,
            title: 'Share via WhatsApp',
          }, {
            dialogTitle: 'Share via WhatsApp',
          });
        }
      });
    }
  },
  {
    id: 5,
    name: 'LinkedIn',
    icon: 'linkedin-square',
    iconType: 'FontAwesome',
    color: '#0A66C2',
    action: (content, comment, showToast) => {
      const message = comment ? `${comment}\n\n${content}` : content;
      
      // Use the native share dialog first
      Share.share({
        message: message,
        title: 'Share to LinkedIn',
      }, {
        dialogTitle: 'Share to LinkedIn',
        subject: 'Share to LinkedIn'
      }).catch(() => {
        // LinkedIn has limited deep linking capabilities
        // Try a universal link for sharing
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://yourapp.com')}&title=${encodeURIComponent(message)}`;
        
        Linking.canOpenURL(linkedInUrl).then(supported => {
          if (supported) {
            Linking.openURL(linkedInUrl);
          } else {
            // If neither works, try to open the app
            Linking.canOpenURL('linkedin://').then(appSupported => {
              if (appSupported) {
                Linking.openURL('linkedin://');
                Clipboard.setString(message);
                showToast('Content copied to clipboard for sharing on LinkedIn.');
              } else {
                Alert.alert('LinkedIn Not Installed', 'LinkedIn app is not installed. Your message has been copied to clipboard.');
                Clipboard.setString(message);
              }
            });
          }
        });
      });
    }
  },
  {
    id: 6,
    name: 'Copy Link',
    icon: 'link',
    iconType: 'FontAwesome',
    color: '#333333',
    action: (content, comment, showToast) => {
      const message = comment ? `${comment}\n\n${content}` : content;
      Clipboard.setString(message);
      showToast('Content copied to clipboard!');
    }
  },
];

const PostShareModal = ({ visible = false, onClose = () => {}, postContent = '' }) => {
  const [comment, setComment] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastOpacity = useState(new Animated.Value(0))[0];
  
  // Toast notification function
  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    
    // Animate the toast in
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.delay(2000),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      setToastVisible(false);
    });
  };

  // Handle direct share to a platform when clicking on it
  const handleDirectShare = (platform) => {
    platform.action(postContent, comment, showToast);
    // Don't close the modal immediately - let the user see the toast and try other options if needed
  };

  // Render each social platform item
  const renderPlatformItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.platformItem} 
        onPress={() => handleDirectShare(item)}
        activeOpacity={0.7}
      >
        <View style={styles.platformInfo}>
          <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
            {item.iconType === 'FontAwesome5' ? (
              <FontAwesome5 name={item.icon} size={24} color={item.color} />
            ) : (
              <FontAwesome name={item.icon} size={24} color={item.color} />
            )}
          </View>
          <Text style={styles.platformName}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setComment('');
        onClose();
      }}
    >
      <TouchableWithoutFeedback onPress={() => {
        setComment('');
        onClose();
      }}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <Text style={styles.modalTitle}>Share Post</Text>
              <Ionicons name="share-social" size={20} color="#333" />
            </View>
            <TouchableOpacity onPress={() => {
              setComment('');
              onClose();
            }} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          {postContent && (
            <View style={styles.postPreview}>
              <Text style={styles.postPreviewText} numberOfLines={3}>
                {postContent}
              </Text>
            </View>
          )}
          
          <View style={styles.commentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={comment}
              onChangeText={setComment}
              placeholderTextColor="#999"
              multiline
              maxLength={150}
            />
          </View>
          
          <Text style={styles.sectionTitle}>Share to</Text>
          
          <FlatList
            data={socialPlatforms}
            renderItem={renderPlatformItem}
            keyExtractor={item => item.id.toString()}
            style={styles.platformList}
            showsVerticalScrollIndicator={false}
          />
          
          {/* Add extra space at the bottom */}
          <View style={styles.bottomSpace}></View>
        </View>
        
        {/* Toast notification */}
        {toastVisible && (
          <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
            <View style={styles.toastContent}>
              <Ionicons name="checkmark-circle" size={24} color="#fff" style={styles.toastIcon} />
              <Text style={styles.toastMessage}>{toastMessage}</Text>
            </View>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: '80%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  postPreview: {
    backgroundColor: '#f0f2f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  postPreviewText: {
    fontSize: 14,
    color: '#333',
  },
  commentContainer: {
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  commentInput: {
    minHeight: 40,
    fontSize: 15,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  platformList: {
    maxHeight: 280,
  },
  platformItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  platformName: {
    fontSize: 16,
    color: '#333',
  },
  bottomSpace: {
    height: 40,
  },
  toast: {
    position: 'absolute',
    bottom: 100,
    left: '10%',
    right: '10%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 30,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  toastIcon: {
    marginRight: 10,
  },
  toastMessage: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PostShareModal;