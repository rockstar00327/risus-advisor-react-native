import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Share,
    Alert
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import EditIconSvg from './SVG/EditIconSvg';
import ShareSvg from './SVG/ShareSvg';
import CopyClipSvg from './SVG/CopyClipSvg';
import * as Clipboard from 'expo-clipboard';
import Toast from '../../../components/Toast/Toast';

const DUMMY_PROFILE_LINK = 'https://risus.com/profile/sarah-anderson';

const ProfileInfo3Dots = ({ visible, onClose, position }) => {
    const navigation = useNavigation();
    const [showToast, setShowToast] = useState(false);

    const handleEditProfile = () => {
        handleClose();
        navigation.navigate("EditProfile");
    };

    const handleShareProfile = async () => {
        try {
            await Share.share({
                message: DUMMY_PROFILE_LINK,
            });
            handleClose();
        } catch (error) {
            Alert.alert('Error', 'Failed to share profile');
        }
    };

    const handleCopyLink = async () => {
        try {
            await Clipboard.setStringAsync(DUMMY_PROFILE_LINK);
            handleClose();
            setShowToast(true);
        } catch (error) {
            console.error('Failed to copy link:', error);
        }
    };

    const handleToastDismiss = () => {
        setShowToast(false);
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <>
            <Modal
                transparent
                visible={visible}
                animationType="none" 
                onRequestClose={handleClose}
                statusBarTranslucent={true} 
            >
                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={[
                        styles.modalContainer,
                        {
                            opacity: visible ? 1 : 0, 
                        }
                    ]}>
                        <View style={[
                            styles.modalContent,
                            {
                                position: 'absolute',
                                top: position.y,
                                right: 16,
                                zIndex: 1000,
                                opacity: visible ? 1 : 0, 
                            }
                        ]}>
                            <TouchableOpacity
                                style={styles.option}
                                onPress={handleEditProfile}
                            >
                                <EditIconSvg />
                                <Text style={styles.optionText}>Edit profile</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.option}
                                onPress={handleShareProfile}
                            >
                                <ShareSvg />
                                <Text style={styles.optionText}>Contact support</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.option}
                                onPress={handleCopyLink}
                            >
                                <CopyClipSvg />
                                <Text style={styles.optionText}>Copy Profile URL</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <Toast
                visible={showToast}
                message="Profile link copied!"
                onDismiss={handleToastDismiss}
            />
        </>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        width: 200,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        gap: 12,
    },
    optionText: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'Figtree-Regular',
    }
});

export default ProfileInfo3Dots;