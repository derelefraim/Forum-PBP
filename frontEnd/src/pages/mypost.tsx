import React from "react";
import { Navbar } from "../components/navbar.tsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";


const mypost: React.FC = () => {
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

  const userId = useParams<{ userId: string }>().userId;
  console.log("User ID from URL:", userId);
  const [myPosts, setMyPosts] = useState<Posts[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/post/mypost/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("My Posts:", response.data);
        setMyPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, [userId]);

  return (
    <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20">
      <Navbar />

      <div className="flex justify-center items-center h-full">
        <h1 className="text-2xl font-bold">My Post</h1>
        <br></br>
        <br></br>
        <br></br>
      </div>

      <div className="p-4">
        {myPosts.length > 0 ? (
          myPosts
            .sort((a: Posts, b: Posts) => b.totalLikes - a.totalLikes)
            .map((post: Posts) => (
              <div
                key={post.post_id}
                className="post mb-4 p-4 bg-gray-800 rounded-lg cursor-pointer"
                onClick={() => navigate(`/post/${post.post_id}`)}
              >
            <div className="title">{post.title}</div>
              <div className="body">{post.content}</div>
              <div className="footer">Posted By : {post.user.username}</div>
              <div className="footer">Total Likes : {Number(post.totalLikes)}</div>
              <div className="footer">Created at : {post.createdAt}</div>
              <div className="footer">Updated at : {post.updatedAt}</div>
              </div>
            ))
        ) : (
          <p className="text-center text-gray-400">No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default mypost;
