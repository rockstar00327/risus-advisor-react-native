import React, { useEffect, useState } from 'react';
import { Share, View, Text, TouchableOpacity, StyleSheet, Modal, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const ReelShareModal = ({ visible, onClose, reelData }) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  const handleNativeShare = async () => {
    try {
      const result = await Share.share({
        message: reelData?.caption || 'Check out this amazing reel!',
        url: reelData?.shareUrl || 'https://yourapp.com/reels/123',
        title: 'Share this Reel',
      });
      
      if (result.action === Share.sharedAction) {
        console.log('Content shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
      
      handleClose();
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleClose = () => {
    setModalVisible(false);
    if (onClose) onClose();
  };

  const socialPlatforms = [
    { name: 'Instagram', icon: 'logo-instagram', color: 'black'},
    { name: 'Twitter', icon: 'logo-twitter', color: 'black' },
    { name: 'Facebook', icon: 'logo-facebook', color: 'black' },
    { name: 'WhatsApp', icon: 'logo-whatsapp', color: 'black' },
    { name: 'Telegram', icon: 'paper-plane', color: 'black' },
    { name: 'Email', icon: 'mail', color: 'black' },
  ];

  const handleSocialShare = (platform) => {
    console.log(`Sharing to ${platform.name}`);
    // Here you would implement platform-specific sharing
    // For now, I'm using the native share
    handleNativeShare();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Share to</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          {reelData?.thumbnail && (
            <View style={styles.previewContainer}>
              <Image 
                source={{ uri: reelData.thumbnail }} 
                style={styles.thumbnail} 
                resizeMode="cover"
              />
              <Text style={styles.caption} numberOfLines={2}>
                {reelData?.caption || 'Check out this amazing reel!'}
              </Text>
            </View>
          )}
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.socialRow}>
            {socialPlatforms.map((platform, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.socialButton}
                onPress={() => handleSocialShare(platform)}
              >
                <View style={[styles.iconContainer, { backgroundColor: platform.color }]}>
                  <Ionicons name={platform.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.socialName}>{platform.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.nativeShareButton}
            onPress={handleNativeShare}
          >
            <Text style={styles.nativeShareText}>More Options</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.copyLinkButton}
            onPress={() => {
              console.log('Link copied');
              // Implement clipboard functionality here
              handleClose();
            }}
          >
            <Ionicons name="link" size={20} color="#fff" />
            <Text style={styles.copyLinkText}>Copy Link</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  caption: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  socialRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  socialButton: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  socialName: {
    fontSize: 12,
    color: '#333',
  },
  nativeShareButton: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  nativeShareText: {
    fontWeight: '600',
    color: '#333',
  },
  copyLinkButton: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyLinkText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default ReelShareModal;