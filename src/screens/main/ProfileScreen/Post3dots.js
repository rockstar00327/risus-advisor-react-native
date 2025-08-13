import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Alert,
    BackHandler
} from 'react-native'
import React, { useEffect } from 'react'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const Post3dots = ({ visible, onClose, postId, onDelete }) => {
    const navigation = useNavigation();

    // Handle hardware back button
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (visible) {
                onClose(); // Just close the modal
                return true;
            }
            return false;
        });

        return () => backHandler.remove();
    }, [visible]);

    const handleClose = () => {
        onClose(); // Just close the modal, don't navigate
    }

    const handleDelete = () => {
        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this post?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: handleClose
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        if (onDelete) {
                            onDelete(postId)
                        }
                        handleClose()
                    },
                },
            ]
        )
    }

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <View style={styles.header}>
                                <Text style={styles.headerText}>Options</Text>
                                <TouchableOpacity 
                                    onPress={handleClose}
                                    style={styles.closeButton}
                                >
                                    <Ionicons name="close" size={24} color="#333" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={styles.deleteOption}
                                onPress={handleDelete}
                            >
                                <MaterialIcons name="delete-outline" size={20} color="#FF3B30" />
                                <Text style={styles.deleteText}>Delete Post</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerText: {
        fontSize: 16,
        fontFamily: 'Figtree-Medium',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    deleteOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        justifyContent: 'center'
    },
    deleteText: {
        fontSize: 16,
        marginLeft: 8,
        color: '#FF3B30',
        fontFamily: 'Figtree-Regular',
    },
})

export default Post3dots    