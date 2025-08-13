import React from "react";
import PostHeader from "../../../components/post/PostHeader";
import { Image, Modal, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native";
import BackArrow from "../../../assets/icons/black-left-arrow.svg";
import PowerImg from "../../../assets/icons/power.svg";
import { View } from "react-native";
import { Entypo, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";

function RepostModal({
  showRepostModal,
  setShowRepostModal,
  selectedPost,
  use,
  setUse,
  navigation,
}) {
  const handleContinue = () => {
    if (use === "AI") {
      navigation.navigate("RepostCreation", {
        post: selectedPost,
      });
    } else {
      navigation.navigate("UploadGallery", {
        post: selectedPost,
      });
    }
    setShowRepostModal(!showRepostModal);
  };

  if (!showRepostModal || !selectedPost) {
    return null;
  }

  const hasValidImage =
    selectedPost?.images &&
    selectedPost.images.length > 0 &&
    selectedPost.images[0]?.image;

  return (
    <View>
      <SafeAreaView style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showRepostModal}
          onRequestClose={() => {
            setShowRepostModal(!showRepostModal);
          }}
        >
          <View style={styles.modalView}>
            {/* Modal Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                marginBottom: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => setShowRepostModal(!showRepostModal)}
              >
                <BackArrow />
              </TouchableOpacity>
              <View
                style={{
                  marginLeft: 65,
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Figtree-Medium",
                    fontSize: 16,
                    marginBottom: 8,
                  }}
                >
                  Repost this post?
                </Text>
                <Text
                  style={{
                    fontFamily: "Figtree-Regular",
                    fontSize: 12,
                    color: "#1E1E1E",
                    marginBottom: 8,
                  }}
                >
                  34k people already reposted
                </Text>
              </View>
            </View>

            {/* post view */}
            <View>
              {selectedPost?.user && <PostHeader user={selectedPost.user} />}
              <TouchableOpacity
                activeOpacity={1}
                // onPress={() =>
                //   navigation.navigate("PostDetails", {
                //     post: {
                //       ...selectedPost,
                //       user: {
                //         name: data?.user?.name || "Mike Jhon",
                //         image: data?.user?.image,
                //         username: data?.user?.username || "@MikeJhon",
                //       },
                //     },
                //   })
                // }
              >
                {hasValidImage ? (
                  <Image
                    style={styles.singleImage}
                    source={{ uri: selectedPost.images[0].image }}
                  />
                ) : (
                  <View
                    style={[styles.singleImage, { backgroundColor: "#e0e0e0" }]}
                  >
                    <Text style={{ textAlign: "center" }}>
                      No image available
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            {/* Options */}
            <View>
              <TouchableOpacity
                //  onPress={() => {
                //   setUse("AI");
                // }}
                style={[
                  styles.row,
                  { justifyContent: "space-between", opacity: 0.5 },
                ]}
              >
                <View style={[styles.row]}>
                  <PowerImg />
                  <View
                    style={{
                      width: 220,
                      marginLeft: 10,
                      marginVertical: 10,
                      marginTop: 25,
                    }}
                  >
                    <Text
                      style={[
                        styles.smallText,
                        {
                          fontSize: 14,
                          color: use === "AI" ? "#0063AC" : "#000",
                        },
                      ]}
                    >
                      Use AI
                    </Text>
                    {/* <Text
                      style={[
                        styles.smallText,
                        { color: use === "AI" ? "#0063AC" : "#575757" },
                      ]}
                    >
                      Enhance your repost with AI-Generated Content
                    </Text> */}
                    <Text
                      style={[
                        styles.smallText,
                        { color: use === "AI" ? "#0063AC" : "#575757" },
                      ]}
                    >
                      This feature is coming soon.
                    </Text>
                  </View>
                </View>
                {use === "AI" ? (
                  <FontAwesome6 name="dot-circle" size={18} color="#0063AC" />
                ) : (
                  <Entypo name="circle" size={18} color="black" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setUse("Gallery");
                }}
                style={[styles.row, { justifyContent: "space-between" }]}
              >
                <View style={[styles.row]}>
                  <FontAwesome5
                    name="images"
                    size={20}
                    color={use === "Gallery" ? "#0063AC" : "#000"}
                  />
                  <View
                    style={{
                      width: 220,
                      marginLeft: 10,
                      marginVertical: 10,
                    }}
                  >
                    <Text
                      style={[
                        styles.smallText,
                        {
                          fontSize: 14,
                          color: use === "Gallery" ? "#0063AC" : "#000",
                        },
                      ]}
                    >
                      Upload from Gallery
                    </Text>
                    <Text
                      style={[
                        styles.smallText,
                        {
                          color: use === "Gallery" ? "#0063AC" : "#575757",
                        },
                      ]}
                    >
                      Choose an Image from your device
                    </Text>
                  </View>
                </View>
                {use === "Gallery" ? (
                  <FontAwesome6 name="dot-circle" size={18} color="#0063AC" />
                ) : (
                  <Entypo name="circle" size={18} color="black" />
                )}
              </TouchableOpacity>
            </View>
            {/* buttons */}
            <View
              style={[
                styles.row,
                { justifyContent: "space-between", marginTop: 20 },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.row,
                  {
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "#000",
                    borderRadius: 8,
                    paddingHorizontal: 50,
                    paddingVertical: 10,
                  },
                ]}
                onPress={() => setShowRepostModal(!showRepostModal)}
              >
                <Text style={{ fontFamily: "Figtree-Medium", fontSize: 14 }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.row,
                  {
                    justifyContent: "center",
                    backgroundColor: "#0063AC",
                    borderWidth: 1,
                    borderColor: "#0063AC",
                    borderRadius: 8,
                    paddingHorizontal: 50,
                    paddingVertical: 10,
                  },
                ]}
                onPress={handleContinue}
              >
                <Text
                  style={{
                    fontFamily: "Figtree-Medium",
                    fontSize: 14,
                    color: "#fff",
                  }}
                >
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

export default RepostModal;
const styles = StyleSheet.create({
  centeredView: {
    //flex: 1,
    //justifyContent: "flex-end",
    //alignItems: "center",
    bottom: 0,
  },
  modalView: {
    margin: 3,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 30,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    top: 130,
    position: "absolute",
    bottom: -40,
    left: -10,
    right: -10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  singleImage: {
    width: "100%",
    borderRadius: 15,
    aspectRatio: 1 / 0.9,
    backgroundColor: "#c8c8c8",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallText: {
    fontFamily: "Figtree-Regular",
    fontSize: 12,
    paddingTop: 8,
  },
  hookContainer2: {
    //width: StoryListItemWidth,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    top: 150,
    right: 10,
    position: "absolute",
  },
});
