import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from "@expo/vector-icons"

const emojiCategories = [
  { id: 'recent', icon: 'time-outline', label: 'Recent' },
  { id: 'smileys', icon: 'happy-outline', label: 'Smileys' },
  { id: 'people', icon: 'people-outline', label: 'People' },
  { id: 'nature', icon: 'leaf-outline', label: 'Nature' },
  { id: 'food', icon: 'fast-food-outline', label: 'Food' },
  { id: 'activities', icon: 'football-outline', label: 'Activities' },
  { id: 'travel', icon: 'airplane-outline', label: 'Travel' },
  { id: 'objects', icon: 'bulb-outline', label: 'Objects' },
  { id: 'symbols', icon: 'heart-outline', label: 'Symbols' },
]

// Sample emojis for demonstration 
const emojis = {
  smileys: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘'],
  people: ['👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👩‍🦱', '👨‍🦱', '👩‍🦰', '👨‍🦰', '👱‍♀️', '👱‍♂️'],
  nature: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷'],
  food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍'],
  // Add more categories as needed
}

const UseEmoji = ({ visible, onClose, onEmojiSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('smileys')
  const [recentEmojis, setRecentEmojis] = useState([])

  const handleEmojiSelect = (emoji) => {
    // Add to recent emojis
    const newRecent = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 20)
    setRecentEmojis(newRecent)
    onEmojiSelect(emoji)
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Choose Emoji</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <View style={styles.categories}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={emojiCategories}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedCategory === item.id && styles.selectedCategory
                  ]}
                  onPress={() => setSelectedCategory(item.id)}
                >
                  <Ionicons 
                    name={item.icon} 
                    size={20} 
                    color={selectedCategory === item.id ? '#0066CC' : '#666'} 
                  />
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
            />
          </View>

          {/* Emojis Grid */}
          <FlatList
            data={selectedCategory === 'recent' ? recentEmojis : emojis[selectedCategory] || []}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.emojiButton}
                onPress={() => handleEmojiSelect(item)}
              >
                <Text style={styles.emoji}>{item}</Text>
              </TouchableOpacity>
            )}
            numColumns={8}
            keyExtractor={(item, index) => index.toString()}
            style={styles.emojiGrid}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '50%',
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
    fontFamily: 'Figtree-Bold',
  },
  closeButton: {
    padding: 4,
  },
  categories: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryButton: {
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  selectedCategory: {
    backgroundColor: '#E1F0FF',
  },
  emojiGrid: {
    flex: 1,
    padding: 8,
  },
  emojiButton: {
    width: '12.5%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
  },
})

export default UseEmoji