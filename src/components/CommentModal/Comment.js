import React, { useState, useRef, useCallback, useEffect } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  TextInput,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "../../func/basicFunc";
import { BASE_URL } from "../../constant/BaseConst";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// comments data
const commentsData = [
  {
    id: 1,
    name: "Tafsirul Islam",
    userProfile: "https://randomuser.me/api/portraits/men/1.jpg",
    comment: "This is a great feature! Looking forward to more updates.",
    likes: 12,
    time: "2 hours ago",
    replies: [
      {
        id: 1,
        name: "Suhaib Safwan",
        isHost: true,
        userProfile: "https://randomuser.me/api/portraits/men/41.jpg",
        comment: "Thank you! More updates coming soon. ",
        time: "1 hour ago",
        likes: 5,
      },
      {
        id: 2,
        name: "Sarah Wilson",
        userProfile: "https://randomuser.me/api/portraits/women/41.jpg",
        comment: "I agree! The updates are amazing!",
        time: "30 mins ago",
        likes: 3,
      },
    ],
  },
  {
    id: 2,
    name: "John Doe",
    userProfile: "https://randomuser.me/api/portraits/men/2.jpg",
    comment: "I think this can be improved by adding more customization.",
    likes: 5,
    time: "3 hours ago",
    replies: [
      {
        id: 1,
        name: "Suhaib Safwan",
        isHost: true,
        userProfile: "https://randomuser.me/api/portraits/men/41.jpg",
        comment: "That's a great idea! We'll consider it. ",
        time: "2 hours ago",
        likes: 4,
      },
      {
        id: 2,
        name: "Mike Johnson",
        userProfile: "https://randomuser.me/api/portraits/men/42.jpg",
        comment: "Yes, customization would be really helpful!",
        time: "1 hour ago",
        likes: 2,
      },
      {
        id: 3,
        name: "Emily Brown",
        userProfile: "https://randomuser.me/api/portraits/women/42.jpg",
        comment: "I'd love to see custom themes!",
        time: "45 mins ago",
        likes: 1,
      },
    ],
  },
  {
    id: 3,
    name: "Alice Smith",
    userProfile: "https://randomuser.me/api/portraits/women/3.jpg",
    comment: "How do I enable this feature? I'm not seeing it in my settings.",
    likes: 8,
    time: "1 hour ago",
    reply:
      "It should be under 'Settings > Features'. Let us know if you still can't find it!",
    replyTime: "45 minutes ago",
    adminProfile: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    id: 4,
    name: "Michael Brown",
    userProfile: "https://randomuser.me/api/portraits/men/4.jpg",
    comment: "Amazing work! Can we expect dark mode soon?",
    likes: 20,
    time: "30 minutes ago",
    reply: "Yes! Dark mode is in development and will be released soon.",
    replyTime: "15 minutes ago",
    adminProfile: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    id: 5,
    name: "Emma Wilson",
    userProfile: "https://randomuser.me/api/portraits/women/5.jpg",
    comment: "This is exactly what I needed. Keep up the good work!",
    likes: 15,
    time: "4 hours ago",
    reply: "We appreciate your support! 😊",
    replyTime: "3 hours ago",
    adminProfile: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    id: 6,
    name: "Samir",
    userProfile: "https://randomuser.me/api/portraits/men/41.jpg",
    comment: "It would be nice if we could have an option to customize the UI.",
    likes: 7,
    time: "2 hours ago",
    reply: "Thanks for the feedback! We'll discuss it with the team.",
    replyTime: "1 hour ago",
  },
  {
    id: 7,
    name: "Sophia Martinez",
    userProfile: "https://randomuser.me/api/portraits/women/41.jpg",
    comment: "I encountered a small bug when using this on mobile.",
    likes: 3,
    time: "5 hours ago",
    reply: "Thanks for reporting! Can you provide more details?",
    replyTime: "4 hours ago",
  },
  {
    id: 8,
    name: "Liam Anderson",
    userProfile: "https://randomuser.me/api/portraits/men/41.jpg",
    comment: "Does this support multiple languages?",
    likes: 6,
    time: "3 hours ago",
    reply: "Yes, we're working on multilingual support!",
    replyTime: "2 hours ago",
  },
  {
    id: 9,
    name: "Olivia Taylor",
    userProfile: "https://randomuser.me/api/portraits/women/41.jpg",
    comment: "Great work! Can I contribute to this project?",
    likes: 11,
    time: "6 hours ago",
    reply: "Of course! We'll share contribution guidelines soon.",
    replyTime: "5 hours ago",
  },
  {
    id: 10,
    name: "Noah Harris",
    userProfile: "https://randomuser.me/api/portraits/men/41.jpg",
    comment: "Loving the new update! Smooth and fast.",
    likes: 13,
    time: "1 hour ago",
    reply: "Glad you like it! Thanks for the support!",
    replyTime: "30 minutes ago",
  },
];
// reply item
const ReplyItem = ({ reply, isLast }) => {
  const [isLiked, setIsLiked] = useState(reply.is_liked);

  return (
    <View style={[styles.replyContainer, isLast && styles.lastReply]}>
      <View style={styles.replyThreadLine} />
      <View style={styles.replyAvatarContainer}>
        <Image
          source={{
            uri:
              reply.user.image ||
              "https://randomuser.me/api/portraits/men/4.jpg",
          }}
          style={styles.replyAvatar}
        />
      </View>

      <View style={styles.replyContentWrapper}>
        <View style={styles.replyHeader}>
          <Text style={styles.replyUserName}>
            {reply.user.display_name && reply.user.display_name !== " "
              ? reply.user.display_name
              : reply.user.username}
          </Text>
          {reply.isHost && (
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#fff" />
              <Text style={styles.adminBadgeText}>Host</Text>
            </View>
          )}
          <Text style={styles.replyTime}>{formatDate(reply.date_created)}</Text>
        </View>

        <View style={styles.replyContentContainer}>
          <Text style={styles.replyText}>
            {reply.content ? reply.content : reply.comment ? reply.comment : ""}
          </Text>

          <TouchableOpacity
            onPress={() => setIsLiked(!isLiked)}
            style={styles.replyLikeButton}
          >
            <View style={styles.likeContainer}>
              {/* <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={16}
                color={isLiked ? "#a3cbff" : "#a3cbff"}
              />
              {reply.likes > 0 && (
                                <Text style={styles.replyLikeCount}>{reply.likes}</Text>
                            )} */}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
// reply input
const ReplyInput = ({ onSubmit, onCancel, commentId }) => {
  const [replyText, setReplyText] = useState("");

  const handleSubmit = () => {
    if (replyText.trim()) {
      onSubmit(replyText, commentId);
      setReplyText("");
    }
  };

  return (
    <View style={styles.replyInputContainer}>
      <TextInput
        style={styles.replyInput}
        placeholder="Write your thoughts..."
        value={replyText}
        onChangeText={setReplyText}
        multiline
      />
      <View style={styles.replyInputActions}>
        <TouchableOpacity onPress={onCancel} style={styles.replyButton}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit} style={styles.replyButton}>
          <Text
            style={[
              styles.replyButtonText,
              !replyText.trim() && styles.disabledButton,
            ]}
          >
            Reply
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
// comment item
const CommentItem = ({
  comment, 
  onLike,
  isLiked: isLikedProp,
  onAddReply,
  postId,
  reelId,
  fetchComments,
  setAlert,
  onAddComment,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []); //changed comment.replies  => comment.replies || [] (1)
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);


  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem("userName");
        const storedUserProfile = await AsyncStorage.getItem("userProfile");

        if (storedUserName) setUserName(storedUserName);
        if (storedUserProfile) setUserProfile(JSON.parse(storedUserProfile));
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
    // console.log(userProfile);
  }, []);

    const handleReplySubmit = useCallback(
    async (replyText, commentId) => {
    const token = await AsyncStorage.getItem("authToken");

    // Create optimistic reply with current timestamp for ID
    const newReply = {
      id: Date.now().toString(),
      content: replyText,
      user: {
        username: userProfile ? userProfile.username : "You",
        display_name: userProfile ? userProfile.display_name : "You",
        image: userProfile
          ? userProfile.image
          : "https://randomuser.me/api/portraits/men/1.jpg",
      },
      date_created: new Date().toISOString(),
      is_liked: false, // Default to not liked
    };

    // Update UI immediately with optimistic reply
    setReplies(prevReplies => [...(prevReplies || []), newReply]);
    setShowReplyInput(false);
    setShowReplies(true); // Always expand replies after adding one

    try {
      const token = await AsyncStorage.getItem("authToken");
      const url = postId
        ? `${BASE_URL}/api/post-comments/?post=${postId}`
        : `${BASE_URL}/api/reels/${reelId}/comments/`;

      const payload = postId
        ? { content: replyText, reply_to: commentId }
        : { comment: replyText, replied_to: commentId };

      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 201) {
        // Replace optimistic reply with actual reply from server
        setReplies(prevReplies =>
          (prevReplies || []).map(reply =>
            reply.id === newReply.id ? response.data : reply
          )
        );
        
        // If the parent component has a callback, call it
        if (onAddReply) {
          onAddReply(commentId, response.data);
        }
      }
    } catch (error) {
      // Remove optimistic reply on error
      setReplies(prevReplies => 
        (prevReplies || []).filter(reply => reply.id !== newReply.id)
      );
      console.error("Error creating reply:", error);
      setAlert({
        visible: true,
        type: "error",
        message: "Failed to create reply. Please try again.",
      });
    }
  },
  [postId, reelId, userProfile, setAlert, onAddReply]
);

  const userImage =
    comment?.user?.image ?? "https://randomuser.me/api/portraits/men/1.jpg";
  const displayName =
    comment?.user?.display_name ?? comment?.user?.username ?? "Anonymous";
  const formattedDate = comment?.date_created
    ? formatDate(comment.date_created)
    : "Unknown";
  const commentText = comment?.content ?? comment?.comment ?? "";
  const isLiked = isLikedProp ?? comment?.is_liked;
  const totalLikes = comment?.total_likes ?? 0;
  const hasReplies = replies && replies.length > 0;


  return (
    <Animated.View
      style={[
        styles.commentWrapper,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.threadLine} />
      <View style={styles.commentContainer}>
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>

          <Image source={{ uri: userImage }} style={styles.avatar} />
        </View>


        <View style={styles.commentContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.timeText}>{formattedDate}</Text>
          </View>

          <Text style={styles.commentText}>{commentText}</Text>


          <View style={styles.commentActions}>
            <TouchableOpacity onPress={onLike} style={styles.actionButton}>
              <View style={styles.likeContainer}>
                {/* <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={18}
                  color={isLiked ? "#E0245E" : "#536471"}
                />
                {totalLikes > 0 && (
                  <Text style={styles.likeCount}>{totalLikes}</Text>

                )} */}
              </View>
            </TouchableOpacity>
            <View style={styles.replyGroup}>
              <TouchableOpacity
                onPress={() => setShowReplyInput(true)}
                style={styles.actionButton}
              >
                <Ionicons name="chatbubble-outline" size={16} color="#536471" />
                <Text style={styles.actionText}>Reply</Text>
              </TouchableOpacity>

              {hasReplies && replies.length > 1 && (
                <TouchableOpacity
                  onPress={() => setShowReplies(!showReplies)}
                  style={styles.actionButton}
                >
                  <Ionicons
                    name={showReplies ? "chevron-up" : "chevron-down"}
                    size={16}
                    color="#536471"
                  />
                  <Text style={styles.actionText}>
                    {replies.length}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>



      {/* Replies Section */}
      {hasReplies && (showReplies || replies.length === 1) && (
        <View style={styles.repliesSection}>
          {replies.map((reply, index) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              isLast={index === replies.length - 1}
            />
          ))}
        </View>
      )}

      {/* Reply Input */}
      {showReplyInput && (
        <ReplyInput
          onSubmit={handleReplySubmit}
          onCancel={() => setShowReplyInput(false)}
          commentId={comment.id}
        />
      )}
    </Animated.View>
  );
};

// comment modal
const Comment = ({
  postId,
  reelId,
  additionalComments = [],
  onAddReplyToAdditional,
  allComments,
  fetchComments,
  setAlert,
}) => {
  const [comments, setComments] = useState(allComments);
  const [likedComments, setLikedComments] = useState(new Set());

  //update comments when allComments prop changes
  useEffect(() => {
    setComments(allComments);
  }, [allComments]);

  const handleAddComment = (newComment) => {
    // new comment to the beginning of the list
    setComments(prevComments => [newComment, ...prevComments]);
  };

  const handleLike = (id) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleAddReply = (commentId, newReply) => {
    const isAdditionalComment = additionalComments.some(
      (comment) => comment.id === commentId
    );

    if (isAdditionalComment && onAddReplyToAdditional) {
      onAddReplyToAdditional(commentId, newReply);
    } else {
      // Update comments immediately with the new reply
      setComments(prevComments =>
        prevComments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply],
            };
          }
          return comment;
        })
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      //contentContainerStyle={styles.contentContainer}
    >
      {comments.map((comment, index) => (
        <CommentItem
          key={`${comment.id}-${index}`}
          comment={comment}
          onLike={() => handleLike(comment.id)}
          isLiked={likedComments.has(comment.id)}
          onAddReply={handleAddReply}
          postId={postId || null}
          reelId={reelId || null}
          fetchComments={fetchComments}
          setAlert={setAlert}
          onAddComment={handleAddComment}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 0,
    marginLeft: -7,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    color: "#0F1419",
    fontFamily: "Figtree-Bold",
    paddingHorizontal: 8,
  },
  commentWrapper: {
    marginBottom: 16,
    position: "relative",
    paddingLeft: 8,
  },
  threadLine: {
    position: "absolute",
    left: 16,
    top: 32,
    bottom: 0,
    width: 1.5,
    backgroundColor: "#EFF3F4",
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    position: "relative",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#ffffff",
  },
  threadConnector: {
    position: "absolute",
    left: 20,
    top: 40,
    bottom: -20,
    width: 2,
    backgroundColor: "#000",
  },
  commentContent: {
    flex: 1,
    paddingRight: 12,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  userName: {
    fontSize: 14,
    fontFamily: "Figtree-Bold",
    color: "#0F1419",
    marginRight: 6,
  },
  timeText: {
    fontSize: 13,
    fontFamily: "Figtree-Regular",
    color: "#536471",
  },
  commentText: {
    fontSize: 14,
    fontFamily: "Figtree-Regular",
    color: "#0F1419",
    lineHeight: 18,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  replyGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 4,
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    fontFamily: "Figtree-Regular",
    color: "#536471",
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  likeCount: {
    fontSize: 13,
    color: "#536471",
    marginLeft: 2,
  },
  repliesSection: {
    marginLeft: 40,
    position: "relative",
  },
  replyContainer: {
    flexDirection: "row",
    position: "relative",
    marginTop: 8,
    paddingLeft: 16,
  },
  replyThreadLine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: "#EFF3F4",
  },
  replyAvatarContainer: {
    position: "relative",
    marginRight: 8,
  },
  replyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#ffffff",
  },
  replyContentWrapper: {
    flex: 1,
    paddingRight: 12,
  },
  replyHeader: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 2,
  },
  replyUserName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F1419",
  },
  replyTime: {
    fontSize: 12,
    color: "#536471",
  },
  replyContentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  replyText: {
    flex: 1,
    fontSize: 13,
    color: "#0F1419",
    lineHeight: 17,
  },
  replyLikeButton: {
    padding: 4,
    alignSelf: "flex-start",
  },
  replyLikeCount: {
    fontSize: 12,
    color: "#a3cbff",
    marginLeft: 2,
  },
  replyInputContainer: {
    marginTop: 8,
    marginBottom: 6,
    marginLeft: 40,
    marginRight: 8,
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
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1D9BF0",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 6,
  },
  adminBadgeText: {
    color: "#ffffff",
    fontSize: 11,
    marginLeft: 2,
    fontFamily: "Figtree-Regular",
  },
});

export default Comment;
