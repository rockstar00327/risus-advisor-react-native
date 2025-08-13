import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Dimensions, 
  StatusBar, 
  Platform,
  FlatList,
  BackHandler 
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react'; 
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

const { width, height } = Dimensions.get("window");

const ImageFullView = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { images, currentIndex = 0, title, content } = route.params;
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const flatListRef = useRef(null);
  const scale = useSharedValue(1);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack(); //navigate => goBack for consistent behavior
      return true;
    });

    return () => backHandler.remove(); // Cleanup listener
  }, [navigation]);

  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale;
    },
    onEnd: () => {
      scale.value = withSpring(1);
    },
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <Animated.Image
          source={{ uri: item.image }}
          style={[styles.image, imageStyle]}
          resizeMode="contain"
        />
      </PinchGestureHandler>
    </View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems[0]) {
      setActiveIndex(viewableItems[0].index);
      navigation.setParams({ currentIndex: viewableItems[0].index });
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  const truncateText = (text, length = 100) => {
    if (!text) return "";
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + "...";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <BlurView intensity={20} tint="dark" style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.counterContainer}>
          <Text style={styles.headerCounter}>
            {activeIndex + 1}/{images?.length}
          </Text>
        </View>
      </BlurView>

      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={currentIndex}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        decelerationRate="fast"
        snapToInterval={width}
        snapToAlignment="center"
      />

      <BlurView 
        intensity={20} 
        tint="dark"
        style={[
          styles.contentContainer,
          { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        ]}
      >
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={styles.content}>
            {isExpanded ? content : truncateText(content)}
            {!isExpanded && content?.length > 100 && (
              <Text style={styles.readMore}> Read More</Text>
            )}
          </Text>
        </TouchableOpacity>
      </BlurView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom:5,
    marginTop: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderBottomColor: "#eee",
    elevation: 0, 
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  counterContainer: {
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  headerCounter: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  title: {
    fontSize: 20,
    fontFamily: "Figtree-Bold",
    marginBottom: 8,
    color: "#fff",
  },
  readMore: {
    color: "rgba(206, 234, 255, 1)",
    fontFamily: "Figtree-Bold",
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Figtree-Regular",
    color: "rgba(255, 255, 255, 0.9)",
  },
  imageContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: width,
    height: height * 0.8,
  }
});

export default ImageFullView;
