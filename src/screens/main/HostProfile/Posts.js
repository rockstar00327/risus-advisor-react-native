import { View } from "react-native";
import React from "react";
import Post from "../FeedPost/Post";

const Posts = ({ posts, user }) => {
  // Dummy data for posts
  const dummyPosts = [
    {
      id: "1",
      title: "Professional Photography Tips 📸",
      content:
        "Here are some essential tips for aspiring photographers. Light is your best friend!",
      images: [
        {
          image:
            "https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?w=800",
        },
        {
          image:
            "https://images.unsplash.com/photo-1461988625982-7e46a099bf4f?w=800",
        },
      ],
      date_created: "2024-03-15T10:00:00Z",
      total_likes: 1200,
      total_comments: 156,
      total_reposts: 45,
      is_liked: false,
      user: {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        username: "johndoe",
        display_name: "John Doe",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
      },
    },
    {
      id: "2",
      title: "Studio Photography Setup 🎨",
      content:
        "A behind-the-scenes look at my studio setup. Perfect lighting makes perfect photos!",
      images: [
        {
          image:
            "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
        },
        {
          image:
            "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",
        },
      ],
      date_created: "2024-03-14T15:30:00Z",
      total_likes: 2500,
      total_comments: 320,
      total_reposts: 89,
      is_liked: false,
      user: {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        username: "johndoe",
        display_name: "John Doe",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
      },
    },
  ];

  return (
    <View style={styles.container}>
      {posts.map((post) => (
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
