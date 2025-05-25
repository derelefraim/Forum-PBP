import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/navbar.tsx";
import { fetchFromAPI } from "../../../backend/src/api/api.ts";
import "../styles/post.css";


interface PostObject {
  title: string;
  content: string;
  user_id: number;
  createdAt: string;
  updatedAt: string;
  user: {
    username: string;
  };
  totalLikes: number;
  comments?: CommentObject[];
}

interface CommentObject {
  comment_id: string;
  content: string;
  user_id: string;
  post_id: string;
  parent_comment_id: string | null;
  updatedAt: string;
  user: UserObject;
  replies?: CommentObject[];
}

interface UserObject {
  username: string;
}

const Post: React.FC = () => {
  const { post_id } = useParams<{ post_id: string }>();
  const [post, setPost] = useState<PostObject | null>(null);
  const [comments, setComments] = useState<CommentObject[]>([]);

  // Tambahan untuk comment baru
  const [newCommentContent, setNewCommentContent] = useState("");

  // Contoh userId, sesuaikan dengan cara kamu dapatkan userId (misal dari context/auth)
  const userId = "user-id-example"; // Ganti dengan userId yang valid

  useEffect(() => {
    if (!post_id) return;
    axios
      .get(`http://localhost:3000/post/${post_id}/getAllVariable`)
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch post:", error);
      });
  }, [post_id]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchFromAPI(`/comment/getComment/${post_id}`);
        setComments(data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (post_id) {
      loadComments();
    }
  }, [post_id]);

  // Fungsi submit comment baru
  const handleAddComment = async () => {
    if (!newCommentContent.trim()) {
      alert("Komentar tidak boleh kosong");
      return;
    }
    try {
      // Kirim POST request ke API createComment
      const response = await axios.post(
        "http://localhost:3000/comment/createComment",
        {
          content: newCommentContent,
          post_id,
          userId, // pastikan userId sesuai
          parent_comment_id: null, // atau bisa buat reply
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Jika pakai JWT token, sesuaikan
          },
        }
      );

      // Setelah berhasil, update state comments dengan komentar baru
      setComments((prev) => [...prev, response.data.comment]);
      setNewCommentContent(""); // reset input
    } catch (error) {
      console.error("Gagal menambahkan komentar:", error);
      alert("Gagal menambahkan komentar");
    }
  };

  return (
    <div className="postPage">
      <Navbar />
      <div className="postPage">
        <div className="leftSide">
          <div className="post" id="individual">
            {post ? (
              <>
                <div className="title">{post.title}</div>
                <div className="body">{post.content}</div>
                <div className="footer">Posted by: {post.user.username}</div>
                <div className="footer">Created at: {post.createdAt}</div>
                <div className="footer">Updated at: {post.updatedAt}</div>
                <div className="footer">Likes: {post.totalLikes}</div>
              </>
            ) : (
              <div>Loading post...</div>
            )}
          </div>
        </div>
      </div>

      <div className="commentSection">
        <h1>Comments</h1>
        <ul>
          {comments.map((comment, idx) => (
            <li
              key={idx}
              style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}
            >
              <div>
              <div><strong>{ comment["user.username"] || "Unknown User" }</strong></div>
              </div>
              <div>{comment.content}</div>
            </li>
          ))}
        </ul>

<div style={{ marginTop: "1rem" }}>
  <textarea
    placeholder="Tulis komentar..."
    value={newCommentContent}
    onChange={(e) => setNewCommentContent(e.target.value)}
    rows={4}
    className="comment-textarea"
  />
  <button onClick={handleAddComment} className="comment-button">
    Tambah Komentar
  </button>
</div>

      </div>
    </div>
  );
};

export default Post;
