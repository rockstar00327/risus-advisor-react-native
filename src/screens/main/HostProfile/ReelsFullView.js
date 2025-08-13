import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
  Animated,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import ReelShareModal from '../../main/reels/ReelShareModal';

const { width, height } = Dimensions.get('screen');

const ReelsFullView = ({ route, navigation }) => {
  const { selectedReelId, reelsData } = route.params;
  const selectedReelIndex = reelsData.findIndex(reel => reel.id === selectedReelId);
  const [currentReel, setCurrentReel] = useState(null);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [overlayVisible, setOverlayVisible] = useState(true);

  useEffect(() => {
    setCurrentReel(reelsData[selectedReelIndex]);
  }, [selectedReelId]);

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: {
        itemVisiblePercentThreshold: 50
      },
      onViewableItemsChanged: ({ viewableItems }) => {
        if (viewableItems && viewableItems.length > 0) {
          setCurrentReel(viewableItems[0].item);
        }
      }
    }
  ]);

  const toggleOverlay = () => {
    Animated.timing(fadeAnim, {
      toValue: overlayVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setOverlayVisible(!overlayVisible));
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);
    setTimeout(() => setShowControls(false), 2000);
  };

  const renderReel = ({ item }) => (
    <View style={styles.reelContainer}>
      <TouchableOpacity
        style={styles.fullScreenTouchable}
        activeOpacity={1}
        onPress={() => {
          handlePlayPause();
          toggleOverlay();
        }}
      >
        <Video
          source={{ uri: item.video }}
          style={styles.video}
          resizeMode="contain"
          shouldPlay={isPlaying}
          isLooping
          useNativeControls={false}
        />

        {/* Play/Pause Indicator */}
        {showControls && (
          <View style={styles.playButton}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={50}
              color="white"
            />
          </View>
        )}

        {/* Back Button */}
        <View style={styles.topContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Overlay Content */}
        {overlayVisible && (
          <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
            <View style={styles.userInfo}>
              <Image source={{ uri: item.user.image }} style={styles.profileImage} />
              <View>
                <Text style={styles.username}>{item.user.display_name}</Text>
                <Text style={styles.caption}>{item.content}</Text>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart-outline" size={24} color="#fff" />
                <Text style={styles.actionText}>{item.total_likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  navigation.navigate('ReelCommentModal', {
                    reelId: item.id
                  });
                }}
              >
                <Ionicons name="chatbubble-outline" size={24} color="#fff" />
                <Text style={styles.actionText}>{item.total_comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  setCurrentReel(item);
                  setShareModalVisible(true);
                }}
              >
                <Ionicons name="share-outline" size={24} color="#fff" />
                <Text style={styles.actionText}>{item.total_shares}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <FlatList
        data={reelsData}
        renderItem={renderReel}
        keyExtractor={item => item.id}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        initialScrollIndex={selectedReelIndex} 
        snapToInterval={height} 
        decelerationRate="fast"
        getItemLayout={(data, index) => (
          { length: height, offset: height * index, index } 
        )}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
      <ReelShareModal
        visible={isShareModalVisible}
        onClose={() => setShareModalVisible(false)}
        reelData={{
          caption: currentReel?.content || '',
          shareUrl: currentReel?.video || '',
          thumbnail: currentReel?.user?.image || '',
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  reelContainer: {
    width: width,
    height: height,
    backgroundColor: '#000',
  },
  fullScreenTouchable: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  playButton: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 15,
  },
  topContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingHorizontal: 15,
    zIndex: 1,
  },
  backButton: {
    padding: 8,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 34,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  caption: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});

export default ReelsFullView;