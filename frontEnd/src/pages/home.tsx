import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/home.css";
import { useNavigate } from "react-router";
import { fetchFromAPI } from "../../../backend/src/api/api.ts";
import { Navbar } from "../components/navbar.tsx";

interface User {
  username: string;
}

interface Posts {
  post_id: string; // UUID biasanya string, bukan number
  title: string;
  content: string;
  user_id: string;
  createdAt: string;
  updatedAt: string;
  totalLikes: number;
  user: User;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Posts[]>([]);
  const [userId, setUSerId] = useState(""); // Tambahkan state username
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState("");

  const handleLike = async (postId: string) => {
    const isLiked = likedPosts[postId];

    try {
      if (isLiked) {
        // Unlike the post
        await axios.delete(`http://localhost:3000/like/unlikepost/${postId}`, {
          data: { userId },
        });

        // Update both likedPosts and posts in a single batch
        setLikedPosts((prev) => ({
          ...prev,
          [postId]: false,
        }));

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.post_id === postId
              ? { ...post, totalLikes: post.totalLikes - 1 }
              : post
          )
        );
      } else {
        // Like the post
        await axios.post(`http://localhost:3000/like/likepost/${postId}`, {
          userId,
        });

        // Update both likedPosts and posts in a single batch
        setLikedPosts((prev) => ({
          ...prev,
          [postId]: true,
        }));

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.post_id === postId
              ? { ...post, totalLikes: post.totalLikes + 1 }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Failed to update like status:", error);
    }
  };

  const fetchData = async () => {
    try {
      const data = await fetchFromAPI("/user/getUserById", "GET");
      setUSerId(data.user.user_id);
      console.log("Profile data:", data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Gagal mengambil data profile.");
    }
  };

  useEffect(() => {
    fetchData();
    axios
      .get("http://localhost:3000/post")
      .then((response) => {
        setPosts(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch posts:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20">
      <Navbar />
      <div className="p-4">
        {posts
          .sort((a, b) => b.totalLikes - a.totalLikes)
          .map((post) => (
            <div
              key={post.post_id}
              className="post"
              onClick={() => navigate(`/post/${post.post_id}`)}
            >
              <div className="title">{post.title}</div>
              <div className="body">{post.content}</div>
              <div className="footer">Posted By : {post.user.username}</div>
              <div className="footer">Total Likes : {post.totalLikes}</div>
              <div className="footer">Created at : {post.createdAt}</div>
              <div className="footer">Updated at : {post.updatedAt}</div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(post.post_id);
                }}
                className={`mt-2 px-4 py-2 rounded ${
                  likedPosts[post.post_id] ? "bg-red-500" : "bg-green-100"
                } hover:bg-opacity-80 transition`}
              >
                {likedPosts[post.post_id] ? "Liked" : "Like"}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
