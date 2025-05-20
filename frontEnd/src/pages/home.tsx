import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/home.css";
import { useNavigate } from "react-router";
import { Navbar } from "../components/navbar.tsx";

interface Posts {
  post_id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  likes: string;
  username: string;
}

const Home: React.FC = () => {


  const navigate = useNavigate();
  const [posts, setPosts] = useState<Posts[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/post").then((response) => {
      setPosts(response.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20">
      <Navbar />

      <div className="p-4">
        {posts.map((post) => (
          <div className="post" onClick={() => navigate(`/post/${post.post_id}`)}>
            <div className="title"> {post.title} </div>
            <div className="body"> {post.content} </div>
            <div className="footer">Posted By : {post.username}</div>
            <div className="footer"> {post.created_at} </div>
            <div className="footer"> {post.updated_at} </div>
            <div className="footer"> Likes : {post.likes} </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
