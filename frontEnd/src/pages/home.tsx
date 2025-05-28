import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/home.css";
import { useNavigate } from "react-router";
import { fetchFromAPI } from "../../../backend/src/api/api.ts";
import { Navbar } from "../components/navbar.tsx";
// import { jwtDecode } from "jwt-decode";




interface User {
  username: string;
}

interface Posts {
  post_id: string;
  title: string;
  content: string;
  user_id: string;
  createdAt: string;
  updatedAt: string;
  totalLikes: number;
  user: User;
  likedByCurrentUser?: boolean;
}



const Home: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Posts[]>([]);
  const [userId, setUserId] = useState("");
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");




  const handleLike = async (postId: string) => {
    const isLiked = posts.find((post) => post.post_id === postId)?.likedByCurrentUser || false;
    try {
      if (isLiked) {
        // Unlike the post
        await axios.delete(
          `http://localhost:3000/like/unlikePost/${postId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLikedPosts((prev) => ({
          ...prev,
          [postId]: false,
        }));
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.post_id === postId
              ? { ...post, totalLikes: Number(post.totalLikes) - 1, likedByCurrentUser: false }
              : post
          )
        );
      } else {
        // Like the post
        await axios.post(
          `http://localhost:3000/like/likepost/${postId}`,
          { userId: userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLikedPosts((prev) => ({
          ...prev,
          [postId]: true,
        }));
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.post_id === postId
              ? { ...post, totalLikes: Number(post.totalLikes) + 1, likedByCurrentUser: true }
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
      // Fetch user data
      const userData = await fetchFromAPI("/user/getUserById", "GET");
      setUserId(userData.user.user_id);

      // Fetch posts data
      const response = await axios.get("http://localhost:3000/post");
      const postsData = response.data;

      // Ngatur Like
      // Map liked posts for the current user
      const likedPostsMap: { [key: string]: boolean } = {};
      for (const post of postsData) {
        try {
          const res = await axios.get(
            `http://localhost:3000/like/getUserLikeStatus/${post.post_id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          likedPostsMap[post.post_id] = res.data.status; // status: true/false dari backend
        } catch (err) {
          likedPostsMap[post.post_id] = false; // fallback jika error
        }
        console.log("post", post.post_id, "liked by user:", likedPostsMap[post.post_id]);
      }

      const postsWithLikeStatus = postsData.map((post: Posts) => ({
        ...post,
        likedByCurrentUser: likedPostsMap[post.post_id] ?? false,
      }));

      setPosts(postsWithLikeStatus);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal mengambil data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    console.log("Posts updated:", posts);
  }, [posts]);








  //post saya











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
              <div className="footer">Total Likes : {Number(post.totalLikes)}</div>
              <div className="footer">Created at : {post.createdAt}</div>
              <div className="footer">Updated at : {post.updatedAt}</div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(post.post_id);
                  console.log("Clicked");
                }}
                className={`mt-2 px-4 py-2 rounded ${post.likedByCurrentUser ? "bg-red-500 text-white" : "bg-green-100 text-black"
                  } hover:bg-opacity-80 transition`}
              >
                {post.likedByCurrentUser ? "Liked" : "Like"}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
