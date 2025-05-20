import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/home.css";
import { useNavigate } from "react-router";
import { Navbar } from "../components/navbar.tsx";

interface User {
  username: string;
}

interface Posts {
  post_id: string;        // UUID biasanya string, bukan number
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  user: User;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Posts[]>([]);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({}); // simpan like count per post_id

  useEffect(() => {
      // Ambil semua post dulu
      axios.get("http://localhost:3000/post").then((response) => {
        setPosts(response.data);

        // Setelah dapat posts, fetch likes untuk tiap post
        response.data.forEach((post: Posts) => {
          axios.get(`http://localhost:3000/like/getAllLikesForPost/${post.post_id}`).then((res) => {
              setLikesMap((prev) => ({
                  ...prev,
                  [post.post_id]: res.data.likes,
              }));
            })
            .catch(() => {
              setLikesMap((prev) => ({
                ...prev,
                [post.post_id]: 0,
              }));
          });
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20">
      <Navbar />

      <div className="p-4">
        {posts.map((post) => (
          <div
            key={post.post_id}
            className="post"
            onClick={() => navigate(`/post/${post.post_id}`)}
          >
            <div className="title">{post.title}</div>
            <div className="body">{post.content}</div>
            <div className="footer">Posted By : {post.user.username}</div>
            <div className="footer">Created at : {post.created_at}</div>
            <div className="footer">Updated at : {post.updated_at}</div>
            <div className="footer">
              Likes : {likesMap[post.post_id] !== undefined ? likesMap[post.post_id] : "Loading..."}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
