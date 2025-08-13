import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const imageSize = (width - 48) / 2; 

const PostPreview = ({ route }) => {
  const navigation = useNavigation();
  const postData = route.params?.postData || {
    title: '',
    content: '',
    images: [],
    userName: '',
    fullName: '',
    profileImage: ''
  };

  const renderImages = () => {
    if (!postData.images || postData.images.length === 0) return null;

    return (
      <View style={styles.imageGrid}>
        {postData.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image.uri || image }}
            style={[
              styles.postImage,
              postData.images.length === 1 && styles.singleImage,
              postData.images.length === 3 && index === 0 && styles.largeImage
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preview Your Post</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.postButton}></Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.userInfo}>
          <View style={styles.userInfoLeft}>
            <Image
              source={{ uri: postData.profileImage }}
              style={styles.profileImage}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.fullName}>{postData.fullName}</Text>
              <Text style={styles.userName}>{postData.userName}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Feather name="more-vertical" size={20} color="black" />
          </TouchableOpacity>
        </View>

        {renderImages()}

        <View style={styles.postContent}>
          <Text style={styles.title}>{postData.title}</Text>
          <Text style={styles.description}>{postData.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postButton: {
    color: '#58AFFF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  userInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#eee', // Placeholder color
  },
  nameContainer: {
    justifyContent: 'center',
  },
  fullName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 14,
    color: '#666',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 8,
  },
  postImage: {
    width: imageSize,
    height: imageSize,
    borderRadius: 8,
  },
  singleImage: {
    width: '100%',
    height: width - 32,
    marginBottom: 16,
  },
  largeImage: {
    width: '100%',
    height: width - 32,
    marginBottom: 8,
  },
  postContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  link: {
    color: '#58AFFF',
    textDecorationLine: 'underline',
  },
});

export default PostPreview;
