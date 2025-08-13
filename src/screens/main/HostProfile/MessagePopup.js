import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Modal } from "react-native";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../../../constant/BaseConst";
import { useNavigation } from "@react-navigation/native";

const MessagePopup = ({ isVisible, onClose, userInfo, showToast }) => {
  const navigation = useNavigation();
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.post(
        `${BASE_URL}/api/rooms/send-message-to-user/`,
        {
          user: userInfo?.id,
          content: msg,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log(response.data);

      if (response.status === 201) {
        console.log("Successfully send message");
        setMsg("");
        onClose();
        showToast(
          `Your Message is successfully send to ${userInfo?.first_name}`
        );
        // setTimeout(() => {
        //     navigation.navigate("conversation", { inbox: item })
        // }, 1500);
        navigation.reset({
          index: 0,
          routes: [
            { name: "MainTabs", state: { routes: [{ name: "Inbox" }] } },
          ],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Write your first message"
            value={msg}
            onChangeText={setMsg}
            multiline
          />
          <View style={styles.replyInputActions}>
            <TouchableOpacity onPress={onClose} style={styles.replyButton}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.replyButton}>
              <Text
                style={[
                  styles.replyButtonText,
                  !msg.trim() && styles.disabledButton,
                ]}
              >
                Send
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MessagePopup;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
    top: "42%",
    left: 0,
    right: 0,
  },
  replyInputContainer: {
    marginTop: 8,
    marginBottom: 6,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#CFD9DE",
  },
  replyInput: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#0F1419",
    minHeight: 40,
  },
  replyInputActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 6,
    borderTopWidth: 1,
    borderTopColor: "#EFF3F4",
  },
  replyButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 8,
  },
  replyButtonText: {
    color: "#536471",
    fontFamily: "Figtree-Bold",
    fontSize: 13,
  },
  cancelButton: {
    color: "#536471",
    fontSize: 13,
    fontFamily: "Figtree-Regular",
  },
});
