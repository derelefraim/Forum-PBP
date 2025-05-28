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
    image_url?: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    totalLikes: number;
    user: User;
    likedByCurrentUser?: boolean;
  }

  const [myPosts, setMyPosts] = useState<Posts[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedContent, setEditedContent] = useState<string>("");
  
  
  
  const userId = useParams<{ userId: string }>().userId;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  console.log("User ID from URL:", userId);








  const savePostEdit = async (postId: string) => {
    if (!editedTitle.trim() || !editedContent.trim()) {
      alert("Title dan content tidak boleh kosong");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/post/${postId}/updatePost`,
        { title: editedTitle, content: editedContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Post berhasil diupdate");

      setMyPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_id === postId
            ? { ...post, title: editedTitle, content: editedContent, updatedAt: new Date().toISOString() }
            : post
        )
      );
     
      setEditingPostId(null);
      setEditedTitle("");
      setEditedContent("");

      
    }catch (error: any) {
        console.error("Gagal mengupdate post:", error.response?.data || error.message || error);
        alert("Gagal mengupdate post");
      
      
    }
  };


  const deletePost = async (postId: string) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus post ini?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`http://localhost:3000/post/${postId}/deletePost`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Update state agar UI langsung berubah tanpa reload
      setMyPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== postId));
  
      alert("Post berhasil dihapus");
    } catch (error) {
      console.error("Gagal menghapus post:", error);
      alert("Gagal menghapus post");
    }
  };
  















  useEffect(() => {
    axios
      .get(`http://localhost:3000/post/mypost/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
          .sort((a, b) => b.totalLikes - a.totalLikes)
          .map((post) =>
            editingPostId === post.post_id ? (
              <div key={post.post_id} className="post mb-4 p-4 bg-gray-800 rounded-lg">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full mb-2 p-2 rounded"
                />
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={4}
                  className="w-full mb-2 p-2 rounded"
                />
                <button
                  onClick={() => savePostEdit(post.post_id)}
                  className="mr-2 bg-green-600 px-3 py-1 rounded"
                >
                  Simpan
                </button>
                <button
                  onClick={() => setEditingPostId(null)}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Batal
                </button>
              </div>
            ) : (
              <div
                key={post.post_id}
                className="post mb-4 p-4 bg-gray-800 rounded-lg cursor-pointer"
                onClick={() => navigate(`/post/${post.post_id}`)}
              >
                <div className="title">{post.title}</div>
              <div className="body">{post.content}</div>
              <div className="body">{post.image_url}</div>   
              <div className="footer">Posted By : {post.user.username}</div>
                <div className="footer">
                Total Likes : {Number(post.totalLikes)} ❤️
                </div>
              <div className="footer">Category : {post.category}</div>
                <div className="footer">
                Created at : {new Date(post.createdAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false
                })}
                </div>
                <div className="footer">
                Updated at : {new Date(post.updatedAt).toLocaleString(undefined, {
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
    e.stopPropagation(); // supaya klik tombol tidak trigger navigate
    setEditingPostId(post.post_id);
    setEditedTitle(post.title);
    setEditedContent(post.content);
  }}
  className="mt-2 bg-blue-600 px-3 py-1 rounded"
>
  Edit Post
</button>

<button
  onClick={(e) => {
    e.stopPropagation();
    deletePost(post.post_id);
  }}
  className="mt-2 bg-red-700 px-3 py-1 rounded ml-2"
>
  Delete Post
</button>
              </div>
            )
          )
      ) : (
        <p className="text-center text-gray-400">No posts found.</p>
      )}
      </div>
    </div>
  );
};

export default mypost;
