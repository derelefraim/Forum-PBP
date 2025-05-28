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
  username: string; // Add this
  replies?: CommentObject[];
}

interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
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
  const [replyingTo, setReplyingTo] = useState<CommentObject | null>(null);
  const [replyContent, setReplyContent] = useState("");
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

      // Fungsi rekursif untuk menghapus comment dari tree
      function removeCommentRecursive(comments: CommentObject[], commentId: string): CommentObject[] {
        return comments
          .filter(comment => comment.comment_id !== commentId)
          .map(comment => ({
            ...comment,
            replies: comment.replies ? removeCommentRecursive(comment.replies, commentId) : [],
          }));
      }

      setComments((prev) => removeCommentRecursive(prev, comment_id));
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
        console.log("API comments:", data.comments); // Tambahkan ini
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

      // If your backend doesn't return username, add it manually:
      // const newComment = { ...response.data.comment, username: user_name };
      // setComments((prev) => [...prev, newComment]);

      // If your backend returns username, just refetch:
      const data = await fetchFromAPI(`/comment/getComment/${post_id}`);
      setComments(data.comments);
      setNewCommentContent("");
      showComment();
    } catch (error) {
      console.error("Gagal menambahkan komentar:", error);
      alert("Gagal menambahkan komentar");
    }
  };

  const closeReplyPopup = () => {
    setReplyingTo(null);
    setReplyContent("");
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim() || !replyingTo) return;
    try {
      await axios.post(
        "http://localhost:3000/comment/createComment",
        {
          content: replyContent,
          post_id,
          parent_comment_id: replyingTo.comment_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Refresh comments
      const data = await fetchFromAPI(`/comment/getComment/${post_id}`);
      setComments(data.comments);
      closeReplyPopup();
    } catch (error) {
      alert("Gagal membalas komentar");
    }
  };

  const renderComments = (comments: CommentObject[], level = 0) => (
    <ul style={{ marginLeft: level * 24 }}>
      {comments.map((comment, idx) => (
        <li
          key={comment.comment_id}
          style={{
            marginBottom: "1rem",
            borderBottom: "1px solid #ccc",
            paddingBottom: "0.5rem",
          }}
        >
          <div>
            <strong>{comment["user.username"] || comment.username || "Unknown User"}</strong>
          </div>
          <div>{comment.content}</div>
          {comment.user_id === userId && (
            <>
              <button
                onClick={() => {
                  setUser_name(comment.username);
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
                style={{ marginRight: "0.5rem" }}
              >
                Delete
              </button>
            </>
          )}
          <button
            onClick={() => setReplyingTo(comment)}
            className="reply-button"
          >
            Reply
          </button>
          {/* Render replies recursively */}
          {comment.replies && comment.replies.length > 0 && renderComments(comment.replies, level + 1)}
        </li>
      ))}
    </ul>
  );

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
                <span className="text-red-500">{Number(post.totalLikes)} ❤️</span>
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
          {renderComments(comments)}
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
        {replyingTo && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-lg mb-2 text-white">
                Reply to: <span className="text-blue-400">{replyingTo.username}</span>
              </h2>
              <textarea
                className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                rows={4}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Tulis balasan..."
              />
              <div className="flex justify-end">
                <button
                  className="mr-2 px-4 py-2 bg-gray-600 rounded text-white"
                  onClick={closeReplyPopup}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 rounded text-white"
                  onClick={handleReplySubmit}
                >
                  Kirim Balasan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
