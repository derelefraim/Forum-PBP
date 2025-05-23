import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/home.css";
import { useNavigate } from "react-router";
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

  useEffect(() => {
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
        {posts.sort((a, b) => b.totalLikes - a.totalLikes) 
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
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
