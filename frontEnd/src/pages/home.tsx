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
  image_url ?: string;
  category : string;
  likedByCurrentUser?: boolean; 
}

// interface TokenPayload {
//   userId: string;
//   iat: number;
//   exp: number;
// }






const Home: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Posts[]>([]);
  const [userId, setUserId] = useState("");
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(3); // Show 3 posts initially
  const token = localStorage.getItem("token");



  const [selectedCategory, setSelectedCategory] = useState<string>(""); // State for selected category

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
      const userData = await fetchFromAPI("/user/getUserById", "GET");
      setUserId(userData.user.user_id);

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

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20">
      <Navbar />
      <div className="p-4">
        {/* Dropdown for sorting by category */}
        <div className="mb-4">
          <label htmlFor="category" className="mr-2" style={{ color: "white" }}>
            Sort by Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="px-2 py-1 rounded bg-gray-700 text-white"
          >
            <option value="">All</option>
            <option value="Teknis">Teknis</option>
            <option value="Entertain">Entertain</option>
            <option value="Marketplace">Marketplace</option>
            <option value="General">General</option>
          </select>
        </div>

        {posts
          .filter((post) =>
            selectedCategory ? post.category === selectedCategory : true
          )
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, visibleCount)
          .map((post) => (
            <div
              key={post.post_id}
              className="post flex items-start justify-between p-4 border-b border-gray-700"
              onClick={() => navigate(`/post/${post.post_id}`)}
            >
              {/* Left Section: Title and Content */}
              <div className="flex-1">
                <div className="title font-bold text-lg mb-2">{post.title}</div>
                <div className="body text-sm text-gray-300 mb-2">{post.content}</div>
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Post Image"
                    className="w-full h-auto rounded mb-2"
                  />
                )}
              </div>

              {/* Right Section: Footer Information */}
              <div className="footer text-sm text-gray-400 ml-4 flex flex-col items-end">
                <div>Posted By: <span className="text-white">{post.user.username}</span></div>
                <div>Total Likes: <span className="text-red-500">{Number(post.totalLikes)} ❤️</span></div>
                <div>Category: <span className="text-blue-400">{post.category}</span></div>
                <div>Created At: <span className="text-green-400">{new Date(post.createdAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false
                })}</span></div>
                <div>Updated At: <span className="text-yellow-400">{new Date(post.updatedAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false
                })}
              </div>
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
        {visibleCount < posts.length && (
          <button
            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            onClick={() => setVisibleCount(posts.length)}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
