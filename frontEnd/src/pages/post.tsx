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
  likedByCurrentUser?: boolean;
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
  const [likedByCurrentUser, setLikedByCurrentUser] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [user_name, setUser_name] = useState<string>("Unknown User");
  const token = localStorage.getItem("token");  

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode<TokenPayload>(token);
      setUserId(decoded.userId);
    }
  }, [token]);

  // Fetch post data
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

  // Fetch like status
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!post_id || !token) return;
      try {
        const res = await axios.get(
          `http://localhost:3000/like/getUserLikeStatus/${post_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLikedByCurrentUser(res.data.status);
      } catch (err) {
        setLikedByCurrentUser(false);
      }
    };
    fetchLikeStatus();
  }, [post_id, token]);

  // Like/Unlike function
  const handleLike = async () => {
    if (!post_id || !token) return;
    try {
      if (likedByCurrentUser) {
        // Unlike
        await axios.delete(
          `http://localhost:3000/like/unlikePost/${post_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLikedByCurrentUser(false);
        setPost((prev) =>
          prev
            ? { ...prev, totalLikes: Number(prev.totalLikes) - 1 }
            : prev
        );
      } else {
        // Like
        await axios.post(
          `http://localhost:3000/like/likepost/${post_id}`,
          { userId: userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLikedByCurrentUser(true);
        setPost((prev) =>
          prev
            ? { ...prev, totalLikes: Number(prev.totalLikes) + 1 }
            : prev
        );
      }
    } catch (error) {
      console.error("Failed to update like status:", error);
    }
  };

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
        setComments((prev) =>
          prev.map((c) =>
            c.comment_id === comment_id ? { ...c, content: editedContent } : c
          )
        );
        setEditingCommentId(null);
        alert("Komentar berhasil diubah");
      })
      .catch((error) => {
        console.error("Gagal mengedit komentar:", error);
        alert("Gagal mengedit komentar");
      });
  };

  const deleteComment = async (comment_id: string) => {
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
  }

  const showComment = (): void => {
    console.log("comments ", comments);
  };

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
      setNewCommentContent("");
      showComment();
    } catch (error) {
      console.error("Gagal menambahkan komentar:", error);
      alert("Gagal menambahkan komentar");
    }
  };

  return (
    <div className="postPage">
      <Navbar />
      <div className="p-4">
        <div
          className="post flex items-start justify-between p-4 border-b border-gray-700 bg-black text-gray-100"
          style={{ borderRadius: "8px", marginBottom: "2rem" }}
        >
          {/* Left Section: Title, Content, Image */}
          <div className="flex-1">
            {post ? (
              <>
                <div className="title font-bold text-lg mb-2">{post.title}</div>
                <div className="body text-sm text-gray-300 mb-2">{post.content}</div>
                {post.image_url && (
                  <img
                    src={`http://localhost:3000/uploads/${post.image_url}`}
                    alt="Post Image"
                    className="post-image"
                    style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "1rem" }}
                  />
                )}
              </>
            ) : (
              <div>Loading post...</div>
            )}
          </div>
          {/* Right Section: Footer Information */}
          {post && (
            <div className="footer text-sm text-gray-400 ml-4 flex flex-col items-end min-w-[220px]">
              <div>
                Posted By: <span className="text-white">{post.user.username}</span>
              </div>
              <div>
                Total Likes: <span className="text-red-500">{Number(post.totalLikes)} ❤️</span>
              </div>
              <div>
                Category: <span className="text-blue-400">{post.category}</span>
              </div>
              <div>
                Created At:{" "}
                <span className="text-green-400">
                  {new Date(post.createdAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </span>
              </div>
              <div>
                Updated At:{" "}
                <span className="text-yellow-400">
                  {new Date(post.updatedAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </span>
              </div>
              <button
                onClick={handleLike}
                className={`mt-2 px-4 py-2 rounded ${
                  likedByCurrentUser
                    ? "bg-red-500 text-white"
                    : "bg-green-100 text-black"
                } hover:bg-opacity-80 transition`}
              >
                {likedByCurrentUser ? "Liked" : "Like"}
              </button>
            </div>
          )}
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
                            setUser_name(comment.user.username);
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
    </div>
  );
};

export default Post;
