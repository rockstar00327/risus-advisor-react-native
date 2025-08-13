import { View } from "react-native";
import React from "react";
import Post from "../FeedPost/Post";

const Posts = ({ posts, user }) => {
  // Dummy data for posts
  const dummyPosts = [
    {
      id: "1",
      user: {
        name: "Sarah Anderson",
        username: "sarahander",
        avatar: require("../../../assets/ProfileScreenImages/Profile.jpg"),
        timeAgo: "2h ago",
      },
      content: {
        title: "Morning Coffee Vibes ☕",
        description:
          "Starting my day with a perfect cup of coffee and some photography planning. The morning light is just perfect today!",
        images: [
          "https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?w=800",
          "https://images.unsplash.com/photo-1461988625982-7e46a099bf4f?w=800",
        ],
      },
      stats: {
        likes: "2.1K",
        comments: "234",
        reposts: "45",
      },
      repostedBy: [
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      ],
      repostCount: 43,
    },
    {
      id: "2",
      user: {
        name: "Sarah Anderson",
        username: "sarahander",
        avatar: require("../../../assets/ProfileScreenImages/Profile.jpg"),
        timeAgo: "1d ago",
      },
      content: {
        title: "Sunset Photography Session 📸",
        description:
          "Captured some amazing moments during golden hour. The colors were absolutely breathtaking!",
        images: [
          "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
          "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
        ],
      },
      stats: {
        likes: "3.4K",
        comments: "456",
        reposts: "89",
      },
      repostedBy: [
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      ],
      repostCount: 87,
    },
  ];

  return (
    <View style={styles.container}>
      {posts?.map((post) => (
        <Post key={post.id} data={{ ...post, user }} />
      ))}
    </View>
  );
};

const styles = {
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
};

export default Posts;
