import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/navbar.tsx";
import { fetchFromAPI } from "../../../backend/src/api/api.ts";
import "../styles/post.css";
import { jwtDecode } from "jwt-decode";

interface PostObject {
  title: string;
  content: string;
  user_id: number;
  image_url: string;
  category: string;
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

interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

interface UserObject {
  username: string;
}

const Post: React.FC = () => {
  const { post_id } = useParams<{ post_id: string }>();
  const [post, setPost] = useState<PostObject | null>(null);
  const [comments, setComments] = useState<CommentObject[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [newCommentContent, setNewCommentContent] = useState("");

 



  const token = localStorage.getItem("token");
  let userId: string | null = null;
  if (token) {
    const decoded = jwtDecode<TokenPayload>(token);
    userId = decoded.userId;
    console.log("User ID dari token:", userId);
  }






  const editComment = (comment_id: string) => {
    if (!editedContent.trim()) {
      alert("Komentar tidak boleh kosong");
      return;
    }

    axios
      .put(
        `http://localhost:3000/comment/updatecomment/${comment_id}`,
        { content: editedContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        // Update state comments supaya kontennya berubah
        setComments((prev) =>
          prev.map((c) =>
            c.comment_id === comment_id ? { ...c, content: editedContent } : c
          )
        );
        setEditingCommentId(null); // keluar dari mode edit
        alert("Komentar berhasil diubah");
      })
      .catch((error) => {
        console.error("Gagal mengedit komentar:", error);
        alert("Gagal mengedit komentar");
      });
  };









  const deleteComment = async (comment_id: string) => {
    console.log("Mau hapus:", comment_id); // Debug

    const confirmDelete = window.confirm("Apakah kamu yakin ingin menghapus komentar ini?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`http://localhost:3000/comment/${comment_id}/deleteComment`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      setComments((prev) => prev.filter((c) => c.comment_id !== comment_id));
      alert("Komentar berhasil dihapus");
    } catch (error: any) {
      console.error("Gagal menghapus komentar:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert("Gagal menghapus komentar");
    }
  };

  


  

//tampilin semua dalma isi  1 post
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










  const handleAddComment = async () => {
    if (!newCommentContent.trim()) {
      alert("Komentar tidak boleh kosong");
      return;
    }
    try {
      //
      const response = await axios.post(
        "http://localhost:3000/comment/createComment",
        {
          content: newCommentContent,
          post_id,

          parent_comment_id: null, 
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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
              style={{
                marginBottom: "1rem",
                borderBottom: "1px solid #ccc",
                paddingBottom: "0.5rem",
              }}
            >
              <div>
                <strong>{comment["user.username"] || "Unknown User"} </strong>
              </div>

              {editingCommentId === comment.comment_id ? (
                <>
                  <textarea
                    rows={3}
                    style={{ width: "100%" }}
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      editComment(comment.comment_id);
                    }}
                    className="save-button"
                    style={{ marginRight: "0.5rem" }}
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => setEditingCommentId(null)}
                    className="cancel-button"
                  >
                    Batal
                  </button>
                </>
              ) : (
                <>
                  <div>{comment.content}</div>

                  {comment.user_id === userId && (
                    <>
                      <button
                        onClick={() => {
                          setEditingCommentId(comment.comment_id);
                          setEditedContent(comment.content);
                        }}
                        className="edit-button"
                        style={{ marginRight: "0.5rem" }}
                      >
                        Edit
                      </button>
                     <button
  onClick={() => deleteComment(comment.comment_id)}
  className="delete-button"
>
  Delete
</button>

                    </>
                  )}
                </>
              )}
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
