import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  PanResponder,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import FeedHeader from "../../components/feed/FeedHeader";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../constant/BaseConst";
import axios from "axios";
import { fetchCurrentUserProfile } from "../../func/basicFunc";

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

export default function HomeFeed() {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Original HomeFeed states
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState("https://advisor-spaces.nyc3.digitaloceanspaces.com/advisor-spaces/advisor-spaces/media/user-images/profile-images/User-2/doraemon.jpg-32aeaa1a29977e19?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=DO801EKTVBWRME6TR432%2F20250809%2Fnyc3%2Fs3%2Faws4_request&X-Amz-Date=20250809T143807Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=d69db8251fc877941347d07f18801945c94b1d7f6bd9a7f4ea186d26849559c0");
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [allnot, setAllNot] = useState([]);
  
  // New states for reposts functionality
  const [showReposts, setShowReposts] = useState(false);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [swipeButtonTranslateY] = useState(new Animated.Value(0));
  const [swipeButtonScale] = useState(new Animated.Value(1));
  const [previewTranslateY] = useState(new Animated.Value(screenHeight));
  const [contentTranslateY] = useState(new Animated.Value(0));
  const [repostsData, setRepostsData] = useState({});
  const [loadingReposts, setLoadingReposts] = useState(false);
  const flatListRef = useRef(null);

  // New states for bottom images animation
  const [bottomImagesOpacity] = useState(new Animated.Value(1));

  // Get default image
  const getDefaultImage = () => 'https://via.placeholder.com/400x500/1A2B3D/FFFFFF?text=No+Image';

  // Get bottom images for current post
  const getBottomImages = () => {
    const currentPost = getCurrentPost();
    if (!currentPost) return [getDefaultImage(), getDefaultImage(), getDefaultImage()];

    const currentReposts = getCurrentPostReposts();
    const images = [];

    // First, add repost images
    currentReposts.forEach(repost => {
      if (repost.images && repost.images.length > 0 && repost.images[0].image) {
        images.push(repost.images[0].image);
      }
    });

    // If we need more images, add main post image
    if (images.length < 3) {
      const mainPostImage = currentPost.images && currentPost.images.length > 0 && currentPost.images[0].image
        ? currentPost.images[0].image
        : getDefaultImage();
      
      const needed = 3 - images.length;
      for (let i = 0; i < needed; i++) {
        images.push(mainPostImage);
      }
    }

    // Take only first 3 images
    return images.slice(0, 3);
  };

  // Animate bottom images when post changes
  const animateBottomImages = useCallback(() => {
    Animated.sequence([
      Animated.timing(bottomImagesOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(bottomImagesOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  }, [bottomImagesOpacity]);

  // Fetch reposts for a specific thread
  const fetchReposts = async (threadId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return [];

      console.log(`Fetching reposts for thread ${threadId}`);
      
      const response = await axios.get(`${BASE_URL}/api/feed/${threadId}/get-reposts/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      console.log(`Reposts for thread ${threadId}:`, response.data);
      return response.data.results || [];
    } catch (error) {
      console.error(`Error fetching reposts for thread ${threadId}:`, error?.response || error);
      return [];
    }
  };

  // Fetch reposts for all posts
  const fetchAllReposts = async (posts) => {
    if (!posts || posts.length === 0) return;

    setLoadingReposts(true);
    const repostsMap = {};

    try {
      // Fetch reposts for each post in parallel
      const repostPromises = posts.map(async (post) => {
        if (post.thread && post.total_reposts > 0) {
          const reposts = await fetchReposts(post.thread);
          return { threadId: post.thread, reposts };
        }
        return { threadId: post.thread, reposts: [] };
      });

      const repostResults = await Promise.all(repostPromises);
      
      repostResults.forEach(({ threadId, reposts }) => {
        if (threadId) {
          repostsMap[threadId] = reposts;
        }
      });

      setRepostsData(repostsMap);
      console.log('All reposts loaded:', repostsMap);
    } catch (error) {
      console.error('Error fetching all reposts:', error);
    } finally {
      setLoadingReposts(false);
    }
  };

  // Original HomeFeed functions
  const fetchFeedPosts = async (
    url = `${BASE_URL}/api/posts/`,
    isRefreshing = false
  ) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return null;

      let finalUrl = url;
      if (url.startsWith("http")) {
        const urlObj = new URL(url);
        finalUrl = `${BASE_URL}${urlObj.pathname}${urlObj.search}`;
      } else {
        finalUrl = `${url}${url.includes("?") ? "&" : "?"}page_size=20`;
      }

      console.log("Fetching from:", finalUrl);

      const { data } = await axios.get(finalUrl, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log(data, '=============')

      if (data) {
        console.log("Next page URL:", data.next);
        if (data.next) {
          const nextUrl = new URL(data.next);
          setNextPageUrl(`${BASE_URL}${nextUrl.pathname}${nextUrl.search}`);
        } else {
          setNextPageUrl(null);
        }

        const newPosts = data.results || [];
        
        setFeedData((prevData) => {
          if (isRefreshing) {
            // Fetch reposts for new posts
            fetchAllReposts(newPosts);
            return newPosts;
          }
          const seenIds = new Set(prevData.map((post) => post.id));
          const filteredNewPosts = newPosts.filter((post) => !seenIds.has(post.id));
          const updatedPosts = [...prevData, ...filteredNewPosts];
          
          // Fetch reposts for new posts only
          if (filteredNewPosts.length > 0) {
            fetchAllReposts(filteredNewPosts);
          }
          
          return updatedPosts;
        });

        // If this is the initial load, fetch reposts
        if (!isRefreshing && feedData.length === 0) {
          fetchAllReposts(newPosts);
        }
      }
    } catch (error) {
      console.error("Error fetching feed posts:", error?.response || error);
      if (error.response?.status === 401) {
        console.log("Authentication error - token might be invalid");
      }
      if (error.response?.status === 404) {
        setNextPageUrl(null);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    console.log("Load more triggered, nextPageUrl:", nextPageUrl);
    if (nextPageUrl && !isLoadingMore && !loading && !refreshing) {
      setIsLoadingMore(true);
      fetchFeedPosts(nextPageUrl, false);
    }
  };

  const handleRefresh = useCallback(async () => {
    console.log("Refresh triggered");
    if (refreshing) return;

    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        setRefreshing(false);
        return;
      }

      const timestamp = new Date().getTime();
      const url = `${BASE_URL}/api/posts/?timestamp=${timestamp}`;

      console.log("Fetching from:", url);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      console.log("Got response:", response.data?.results?.length);

      if (response.data) {
        setNextPageUrl(response.data?.next);
        const newPosts = response.data?.results || [];
        setFeedData(newPosts);
        
        // Fetch reposts for refreshed posts
        fetchAllReposts(newPosts);
      }
    } catch (error) {
      console.error("Error refreshing feed:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const getCurrentUser = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return null;
      const { data } = await axios.get(`${BASE_URL}/api/user/profile/`, {
        headers: { Authorization: `Token ${token}` },
      });

      setAvatar(
        data?.image
          ? data?.image
          : "https://randomuser.me/api/portraits/women/40.jpg"
      );
      return data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  };

  const fetchNotifications = async () => {
    const token = await AsyncStorage.getItem("authToken");
    try {
      const response = await fetch(`${BASE_URL}/api/notifications/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setAllNot(result.results || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // New functions for reposts functionality
  const getCurrentPost = () => {
    return feedData[currentPostIndex] || feedData[0];
  };

  const getCurrentPostReposts = () => {
    const currentPost = getCurrentPost();
    if (!currentPost || !currentPost.thread) return [];
    return repostsData[currentPost.thread] || [];
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dy) > 10;
    },
    
    onPanResponderGrant: () => {
      Animated.spring(swipeButtonScale, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }).start();
    },
    
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy < 0) {
        const buttonMoveY = Math.max(gestureState.dy, -100);
        swipeButtonTranslateY.setValue(buttonMoveY);
        
        const previewY = Math.max(screenHeight + gestureState.dy * 2, screenHeight * 0.7);
        previewTranslateY.setValue(previewY);
        
        const scale = Math.max(0.9, 1 + gestureState.dy / 1000);
        swipeButtonScale.setValue(scale);
      }
    },
    
    onPanResponderRelease: (evt, gestureState) => {
      const isSwipeUp = gestureState.dy < -50 && gestureState.vy < -0.5;
      
      if (isSwipeUp) {
        switchToRepostsView();
      } else {
        resetSwipeAnimations();
      }
    },
    
    onPanResponderTerminate: () => {
      resetSwipeAnimations();
    },
  });

  const resetSwipeAnimations = () => {
    Animated.parallel([
      Animated.spring(swipeButtonScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
      Animated.spring(swipeButtonTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
      Animated.spring(previewTranslateY, {
        toValue: screenHeight,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      })
    ]).start();
  };

  const switchToRepostsView = () => {
    Animated.parallel([
      Animated.spring(contentTranslateY, {
        toValue: -screenHeight,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }),
      Animated.spring(previewTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      })
    ]).start(() => {
      setShowReposts(true);
      swipeButtonTranslateY.setValue(0);
      swipeButtonScale.setValue(1);
    });
  };

  const switchBackToFeed = () => {
    Animated.parallel([
      Animated.spring(contentTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }),
      Animated.spring(previewTranslateY, {
        toValue: screenHeight,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      })
    ]).start(() => {
      setShowReposts(false);
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((Number(now) - Number(date)) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getUserDisplayName = (user) => {
    if (!user) return 'Unknown User';
    if (user.display_name) {
      return user.display_name;
    }
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.username || 'Unknown User';
  };

  const renderRepostsHeader = () => (
    <View style={styles.repostsHeader}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F8FF" />
      <View style={styles.repostsHeaderTop}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={switchBackToFeed}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.repostsTitle}>Reposts</Text>
        <View style={styles.headerSpacer} />
      </View>
    </View>
  );

  const renderMainPost = ({ item: post, index }) => {
    if (!post) return null;
    
    const postReposts = repostsData[post.thread] || [];
    
    return (
      <View style={styles.postContainer} key={index}>
        <View style={styles.mainPostContainer}>
          
          <View style={styles.postImageContainer}>
            <Image 
              source={
                post.images && post.images.length > 0 && post.images[0].image
                  ? { uri: post.images[0].image }
                  : { uri: getDefaultImage() }
              } 
              style={styles.postImage} 
            />
            
            <View style={styles.postHeader}>
              <Image 
                source={
                  post.user && post.user.image 
                    ? { uri: post.user.image }
                    : { uri: 'https://via.placeholder.com/36x36/94A3B8/FFFFFF?text=U' }
                } 
                style={styles.postAvatar} 
              />
              <View style={styles.postUserInfo}>
                <Text style={styles.postUserName}>{getUserDisplayName(post.user)}</Text>
                <Text style={styles.postUsername}>@{post.user?.username || 'unknown'} • {formatTime(post.date_created)}</Text>
              </View>
            </View>
            <View style={styles.postStats}>
              <View style={styles.likesContainer}>
                <Image source={require('../../../assets/images/likes.png')} style={styles.statIcon} />
                <Text style={styles.statText}>{post.total_likes || '0'}</Text>
              </View>
              <View style={styles.commentsContainer}>
                <Image source={require('../../../assets/images/comments.png')} style={styles.statIcon} />
                <Text style={styles.statText}>{post.total_comments || '0'}</Text>
              </View>
            </View>
            
            <View style={styles.postTextOverlay}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={styles.postTextOnImage}>{post.content || ''}</Text>
                <TouchableOpacity style={styles.readMoreOnImage}>
                  <Text style={styles.readMoreTextOnImage}>Read More</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.MainPostBottomIcon}>
                <Image source={require('../../../assets/images/mainpost.png')} style={styles.MainPostBottomImage} />
              </View>
            </View>
          </View>
        </View>
        
        {postReposts.length > 0 && (
          <View style={styles.repostUsersSection}>
            <View style={styles.avatarStack}>
              {postReposts.slice(0, 5).map((repost, avatarIndex) => (
                <Image 
                  key={repost.id}
                  source={
                    repost.user && repost.user.image
                      ? { uri: repost.user.image }
                      : { uri: 'https://via.placeholder.com/36x36/94A3B8/FFFFFF?text=U' }
                  } 
                  style={[styles.smallAvatar, { marginLeft: avatarIndex * -8 }]} 
                />
              ))}
            </View>
            <Text style={styles.repostText}>
              {post.total_reposts > 5
                ? `${post.total_reposts - 5} more reposted`
                : ''}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderRepostItem = (item, index) => {
    if (!item || !item.user) return null;
    
    const isEven = index % 2 === 0;
    
    return (
      <View key={item.id} style={[styles.repostSection, isEven ? styles.repostSectionLeft : styles.repostSectionRight]}>
        {isEven && (
          <View style={styles.repostDateLeft}>
            <Text style={styles.dateText}>{new Date(item.date_created).toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}</Text>
            <Image source={require('../../../assets/images/calendar.png')} style={styles.calendar}/>
          </View>
        )}
        
        <View style={[styles.repostItem, isEven ? styles.repostItemLeft : styles.repostItemRight]}>
          <View style={styles.repostHeader}>
            <Image 
              source={
                item.user.image
                  ? { uri: item.user.image }
                  : { uri: 'https://via.placeholder.com/32x32/94A3B8/FFFFFF?text=U' }
              } 
              style={styles.repostAvatar} 
            />
            <View style={styles.repostUserInfo}>
              <Text style={styles.repostUserName}>{getUserDisplayName(item.user)}</Text>
              <Text style={styles.repostUsername}>@{item.user.username || 'unknown'} • {formatTime(item.date_created)}</Text>
            </View>
          </View>
          <Text style={styles.repostTextContent}>{item.content || ''}</Text>
          {item.images && item.images.length > 0 && (
            <Image 
              source={{ uri: item.images[0].image }} 
              style={styles.repostImage} 
            />
          )}
        </View>
        
        {!isEven && (
          <View style={styles.repostDateRight}>
            <Text style={styles.dateText}>{new Date(item.date_created).toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}</Text>
            <Image source={require('../../../assets/images/calendar.png')} style={styles.calendar}/>
          </View>
        )}
      </View>
    );
  };

  const renderEmptyReposts = () => (
    <View style={styles.emptyRepostsContainer}>
      <Text style={styles.emptyRepostsTitle}>No reposts yet</Text>
      <Text style={styles.emptyRepostsText}>
        This post has not been reposted by anyone yet. Be the first to share it!
      </Text>
    </View>
  );

  const renderRepostsContent = () => {
    const currentPost = getCurrentPost();
    const currentReposts = getCurrentPostReposts();
    
    if (!currentPost) return null;
    
    const hasReposts = currentReposts.length > 0;
    
    return (
      <Animated.View 
        style={[
          styles.repostsContainer,
          {
            transform: [{ translateY: previewTranslateY }]
          }
        ]}
      >
        {renderRepostsHeader()}
        
        <ScrollView style={styles.repostsScrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.originalPostThumbnail}>
            <Image 
              source={
                currentPost.images && currentPost.images.length > 0 && currentPost.images[0].image
                  ? { uri: currentPost.images[0].image }
                  : { uri: getDefaultImage() }
              } 
              style={styles.thumbnailImage} 
            />
            <View style={styles.thumbnailOverlay}>
              <Image 
                source={
                  currentPost.user && currentPost.user.image
                    ? { uri: currentPost.user.image }
                    : { uri: 'https://via.placeholder.com/32x32/94A3B8/FFFFFF?text=U' }
                } 
                style={styles.thumbnailAvatar} 
              />
              <View style={styles.thumbnailInfo}>
                <Text style={styles.thumbnailUserName}>{getUserDisplayName(currentPost.user)}</Text>
                <Text style={styles.postUsername}>@{currentPost.user?.username || 'unknown'}</Text>
              </View>
            </View>
            
            {/* Like icon and count overlaid on thumbnail */}
            <View style={styles.thumbnailLikeOverlay}>
              <Image source={require('../../../assets/images/likes.png')} style={styles.thumbnailLikeIcon} />
              <Text style={styles.thumbnailLikeText}>{currentPost.total_likes || '0'}</Text>
            </View>
          </View>
          
          {loadingReposts ? (
            <View style={styles.loadingRepostsContainer}>
              <Text style={styles.loadingRepostsText}>Loading reposts...</Text>
            </View>
          ) : (
            <View style={styles.repostsList}>
              {hasReposts ? (
                currentReposts.map((item, index) => renderRepostItem(item, index))
              ) : (
                renderEmptyReposts()
              )}
            </View>
          )}
        </ScrollView>
      </Animated.View>
    );
  };

  // Render bottom images component
  const renderBottomImages = () => {
    const bottomImages = getBottomImages();
    
    return (
      <Animated.View 
        style={[
          styles.bottomImagesContainer,
          {
            opacity: bottomImagesOpacity
          }
        ]}
      >
        {bottomImages.map((imageUri, index) => {
          // Apply different styles based on position
          let imageStyle = [styles.bottomImage];
          let wrapperStyle = [styles.bottomImageWrapper];
          
          if (index === 0) {
            // First image - rotate left with strong blur
            wrapperStyle.push(styles.leftImageWrapper);
            imageStyle.push(styles.leftImage);
          } else if (index === 1) {
            // Center image - gradient blur effect (simulated with overlay)
            wrapperStyle.push(styles.centerImageWrapper);
            imageStyle.push(styles.centerImage);
          } else if (index === 2) {
            // Third image - rotate right with strong blur
            wrapperStyle.push(styles.rightImageWrapper);
            imageStyle.push(styles.rightImage);
          }
          
          return (
            <View key={index} style={wrapperStyle}>
              <Image 
                source={{ uri: imageUri }}
                style={imageStyle}
                blurRadius={index === 1 ? 2 : 36} // Light blur for center, strong blur for sides
              />
              {/* Gradient overlay for center image to simulate gradient blur */}
              {index === 1 && (
                <View style={styles.gradientOverlay} />
              )}
            </View>
          );
        })}
      </Animated.View>
    );
  };

  // Additional scroll handler to ensure current post tracking
  const handleScroll = useCallback((event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(scrollX / screenWidth);
    
    if (newIndex !== currentPostIndex && newIndex >= 0 && newIndex < feedData.length) {
      setCurrentPostIndex(newIndex);
      animateBottomImages(); // Animate when post changes
      console.log(`Current post changed via scroll to index: ${newIndex}, Post ID: ${feedData[newIndex]?.id}, Thread: ${feedData[newIndex]?.thread}`);
    }
  }, [currentPostIndex, feedData, screenWidth, animateBottomImages]);

  // Additional scroll handler for momentum end
  const handleMomentumScrollEnd = useCallback((event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(scrollX / screenWidth);
    
    if (newIndex !== currentPostIndex && newIndex >= 0 && newIndex < feedData.length) {
      setCurrentPostIndex(newIndex);
      animateBottomImages(); // Animate when post changes
      console.log(`Current post changed via momentum end to index: ${newIndex}, Post ID: ${feedData[newIndex]?.id}, Thread: ${feedData[newIndex]?.thread}`);
    }
  }, [currentPostIndex, feedData, screenWidth, animateBottomImages]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      // Find the item that's most visible (closest to center of screen)
      const centerX = screenWidth / 2;
      let mostVisibleItem = viewableItems[0];
      let minDistance = Math.abs(viewableItems[0].index * screenWidth + screenWidth / 2 - centerX);
      
      viewableItems.forEach((item) => {
        const itemCenterX = item.index * screenWidth + screenWidth / 2;
        const distance = Math.abs(itemCenterX - centerX);
        if (distance < minDistance) {
          minDistance = distance;
          mostVisibleItem = item;
        }
      });
      
      const newIndex = mostVisibleItem.index;
      if (newIndex !== null && newIndex !== undefined && newIndex !== currentPostIndex) {
        setCurrentPostIndex(newIndex);
        animateBottomImages(); // Animate when post changes
        console.log(`Current post changed to index: ${newIndex}, Post ID: ${feedData[newIndex]?.id}, Thread: ${feedData[newIndex]?.thread}`);
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 30,
    minimumViewTime: 100,
    waitForInteraction: false
  }).current;

  const renderSwipePreview = () => {
    const currentPost = getCurrentPost();
    const currentReposts = getCurrentPostReposts();
    
    if (!currentPost) return null;
    
    const repostCount = currentReposts.length;
    
    return (
      <Animated.View 
        style={[
          styles.swipePreview,
          {
            transform: [{ translateY: previewTranslateY }]
          }
        ]}
        pointerEvents="none"
      >
        <View style={styles.previewHeader}>
          <View style={styles.dragHandle} />
          <Text style={styles.previewTitle}>Release to view reposts</Text>
        </View>
        <View style={styles.previewContent}>
          <View style={styles.previewPost}>
            <Image 
              source={
                currentPost.images && currentPost.images.length > 0 && currentPost.images[0].image
                  ? { uri: currentPost.images[0].image }
                  : { uri: getDefaultImage() }
              } 
              style={styles.previewImage} 
            />
            <Text style={styles.previewText}>
              {repostCount > 0 ? `${repostCount} reposts available` : 'No reposts yet'}
            </Text>
            <Text style={styles.previewSubText}>
              Post by @{currentPost.user?.username || 'unknown'}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  useEffect(() => {
    fetchFeedPosts();
    getCurrentUser();
    fetchNotifications();
    fetchCurrentUserProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (route?.params?.fromPostCreate) {
        if (route.params.newPost) {
          setFeedData((prevData) => [route.params.newPost, ...prevData]);
        }
        navigation.setParams({ fromPostCreate: false, newPost: null });
      }
    }, [route?.params?.fromPostCreate])
  );

  if (loading) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  const userImage = "https://randomuser.me/api/portraits/lego/4.jpg";

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.mainContent,
          {
            transform: [{ translateY: contentTranslateY }]
          }
        ]}
      >

        <FeedHeader
          userImage={avatar || userImage}
          notifications={allnot?.result || []}
        />
        
        <FlatList
          ref={flatListRef}
          data={feedData}
          renderItem={renderMainPost}
          keyExtractor={(item) => item.id.toString()}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          style={styles.postsList}
          initialScrollIndex={0}
          getItemLayout={(data, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
        
        {/* {feedData.length > 0 && (
          <View style={styles.pageIndicators}>
            {feedData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.pageIndicator,
                  { opacity: index === currentPostIndex ? 1 : 0.3 }
                ]}
              />
            ))}
          </View>
        )} */}

        {/* Bottom Images Component */}
        {feedData.length > 0 && renderBottomImages()}
        
        <Animated.View 
          style={[
            styles.fixedSwipeButton,
            {
              transform: [
                { scale: swipeButtonScale },
                { translateY: swipeButtonTranslateY }
              ]
            }
          ]}
          {...panResponder.panHandlers}
        >
          <Image 
            source={require('../../../assets/images/swipe_button.png')}
            style={styles.swipeArrow} 
          />
          <Text style={styles.swipeUpText}>
            Swipe Up to see the reposts
          </Text>
        </Animated.View>
      </Animated.View>
      
      {!showReposts && renderSwipePreview()}
      {renderRepostsContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  logoImage: {
    width: 88,
    height: 36
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingRepostsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingRepostsText: {
    fontSize: 16,
    color: '#64748B',
  },
  mainContent: {
    flex: 1,
  },
  header: {
    backgroundColor: '#F0F8FF',
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  notificationBadge: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    borderRadius: 16,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderColor: '#000000',
    borderWidth: 1
  },
  notificationImage: {
    width: 20,
    height: 20
  },
  badgeText: {
    fontFamily: 'Inter',
    color: '#131313',
    fontSize: 16,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  searchIcon: {
    padding: 5,
  },
  searchIconImage: {
    width: 24,
    height: 24
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 10,
    gap: 10,
    width: '33%'
  },
  activeTab: {
    backgroundColor: '#9BD4FF40',
  },
  tabIcon: {
    width: 14,
    height: 14,
    objectFit: 'cover'
  },
  tabText: {
    fontFamily: 'Figtree_400Regular',
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: 14,
    lineHeight: 1,
    letterSpacing: 0,
    textAlign: 'center',
    verticalAlign: 'middle',
    paddingVertical: 12,
    paddingHorizontal: 8
  },
  activeTabText: {
    color: '#0167CC',
    fontWeight: '600',
  },
  
  postsList: {
    flex: 1,
  },
  postContainer: {
    width: screenWidth,
    paddingHorizontal: 0,
  },
  
  mainPostContainer: {
    backgroundColor: '#1A2B3D',
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  postHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  postUserInfo: {
    flex: 1,
    marginLeft: 12,
  },
  postUserName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  postUsername: {
    color: '#FFFFFF80',
    textTransform: 'lowercase',
    fontWeight: '400',
    fontSize: 12,
  },
  postImageContainer: {
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: 500,
    resizeMode: 'cover',
  },
  postStats: {
    position: 'absolute',
    bottom: 72,
    right: 12,
    alignItems: 'center',
  },
  likesContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  commentsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statIcon: {
    width: 28,
    height: 28,
    marginRight: 4,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  postTextOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  postTextOnImage: {
    color: '#FFFFFF',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginBottom: 4,
  },
  readMoreOnImage: {
    alignSelf: 'flex-start',
  },
  readMoreTextOnImage: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    textDecorationLine: 'underline'
  },
  MainPostBottomIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0063AC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  MainPostBottomImage: {
    width: 28,
    height: 28,
  },
  
  repostUsersSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 0,
    paddingBottom: 16,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  smallAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
  },
  repostText: {
    fontFamily: 'Figtree',
    color: '#000000',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    flex: 1,
  },
  
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 220,
    width: '100%',
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#60A5FA',
    marginHorizontal: 4,
  },
  bottomImagesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bottomImageWrapper: {
    marginHorizontal: 4,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomImage: {
    width: 250,
    height: 200,
    resizeMode: 'cover',
  },
  leftImageWrapper: {
    transform: [{ rotate: '-15deg' }],
    zIndex: 1,
    marginRight: -50
  },
  leftImage: {
    // Additional styles for left image if needed
  },
  centerImageWrapper: {
    zIndex: 3,
    marginTop: -75,
    position: 'relative',
  },
  centerImage: {
    // Light blur effect is applied via blurRadius prop
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '10%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  rightImageWrapper: {
    transform: [{ rotate: '15deg' }],
    zIndex: 1,
    marginLeft: -50,
  },
  rightImage: {
    // Additional styles for right image if needed
  },
  fixedSwipeButton: {
    position: 'absolute',
    height: 48,
    bottom: 32,
    left: 64,
    right: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
    borderRadius: 24,
    paddingTop: 12,
    paddingRight: 16,
    paddingBottom: 12,
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: '#A9A9A9',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    gap: 10
  },
  swipeUpText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '400',
  },
  swipeArrow: {
    width: 24,
    height: 24
  },
  
  swipePreview: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.25,
    backgroundColor: '#F0F8FF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  previewHeader: {
    padding: 16,
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#60A5FA',
  },
  previewContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewPost: {
    alignItems: 'center',
  },
  previewImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  previewSubText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  
  repostsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F0F8FF',
  },
  repostsHeader: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  repostsHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#60A5FA',
    fontWeight: 'bold',
  },
  repostsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  headerSpacer: {
    width: 40,
  },
  repostsScrollView: {
    flex: 1,
  },
  originalPostThumbnail: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  thumbnailOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnailAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  thumbnailInfo: {
    flex: 1,
  },
  thumbnailUserName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  repostsList: {
    paddingHorizontal: 16,
  },
  
  repostSection: {
    width: '100%',
    marginBottom: 16,
    paddingLeft: 32, // Standard padding from screen edges
    position: 'relative',
  },
  
  repostItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%', // Full width like in second image
    position: 'relative',
    gap: 8
  },
  repostItemLeft: {
    // Remove margins for full width
  },
  repostItemRight: {
    // Remove margins for full width
  },
  
  // Date section positioned on the left side for all items
  repostDateLeft: {
    position: 'absolute',
    left: 0, // Position outside the main container
    top: '50%',
    transform: [{ translateY: -25 }], // Center vertically
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 50,
    zIndex: 1,
    gap: 30
  },
  repostDateRight: {
    position: 'absolute',
    left: 0, // Position outside the main container (same as left for consistency)
    top: '50%',
    transform: [{ translateY: -25 }], // Center vertically
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 50,
    zIndex: 1,
    gap: 30
  },
  
  dateText: {
    fontSize: 14,
    color: '#64748B', // Lighter color to match the design
    fontWeight: '400',
    transform: [{ rotate: '-90deg' }],
    width: 90,
    textAlign: 'center',
    marginBottom: 4,
  },
  calendar: {
    width: 20, // Smaller icon
    height: 20, // Smaller icon
    // tintColor: '#64748B', // Match text color
  },
  
  repostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  repostAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  repostUserInfo: {
    marginLeft: 12,
  },
  repostUserName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  repostUsername: {
    fontSize: 12,
    fontWeight: '400',
    textTransform: 'lowercase',
    color: '#00000080',
  },
  repostTextContent: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: '#000000',
  },
  repostImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  emptyRepostsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyRepostsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyRepostsText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  thumbnailLikeOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  thumbnailLikeIcon: {
    width: 26,
    height: 26,
  },
  thumbnailLikeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
  },
});