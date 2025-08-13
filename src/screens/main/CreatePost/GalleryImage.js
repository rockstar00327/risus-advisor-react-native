import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons'

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const imageWidth = (screenWidth - 48) / 2; 

const GalleryImage = ({ selectedImages, removeImage }) => {
  if (selectedImages.length === 0) return null;

  const renderItem = ({ item, index }) => (
    <View style={styles.imagePreviewContainer}>
      <Image 
        source={{ uri: item.uri }} 
        style={styles.imagePreview}
        resizeMode="cover"
      />
      <TouchableOpacity 
        style={styles.removeImageButton}
        onPress={() => removeImage(index)}
      >
        <Feather name="x" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.selectedImagesContainer}>
      <Text style={styles.sectionTitle}>Selected Images</Text>
      <FlatList
        data={selectedImages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false} 
        contentContainerStyle={styles.flatListContent}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  selectedImagesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Figtree-Medium',
    color: '#000',
    marginBottom: 8,
  },
  flatListContent: {
    paddingHorizontal: 2,
  },
  imagePreviewContainer: {
    width: imageWidth,
    marginBottom: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: imageWidth, 
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF3B30',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 2,
  },
})

export default GalleryImage