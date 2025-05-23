import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "../components/navbar.tsx";
import { fetchFromAPI } from "../../../backend/src/api/api.ts";

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

  useEffect(() => {
    console.log("post_id", post_id);
    if (!post_id) return;
    axios.get(`http://localhost:3000/post/${post_id}/getAllVariable`).then((response) => {
      setPost(response.data);
      console.log("Post:", response.data);
    })
      .catch((error) => {
        console.error("Failed to fetch post:", error);
      });
  }, [post_id]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchFromAPI(`/comment/getComment/${post_id}`); // adjust endpoint
        setComments(data.comments); // 'comments' is from res.json({ comments: roots })
        console.log("Comments:", data.comments);
        console.log("Username:", data.comments[0].user.username);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

  //   loadComments();
  // }, []);
  // useEffect(() => {
  //     const fetchProfile = async () => {
  //       try {
  //           const data = await fetchFromAPI(`/comment/getComment/${post_id}`, "GET");        setComments(data.comment || data);
  //         console.log("Comments:", data);
  //       } catch (err) {
  //         console.error("Error fetching profile:", err);
  //       }
  //     };
  //     fetchProfile();
  //   }, []);

  // useEffect(() => {
  //   if (!post_id) return;
  //   fetchFromAPI(`/comment/getComment/${post_id}`)
  //     .then((response) => {
  //       const comments = response?.data?.comments ?? [];
  //       setComments(comments);
  //       console.log("Comments:", comments);
  //     })
  //     .catch((error) => {
  //       console.error("Failed to fetch comments:", error);
  //       setComments([]);
  //     });
  // }, [post_id]);


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
          <li key={idx} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
            <div><strong>{ comment["user.username"] || "Unknown User" }</strong></div>
            <div> {comment.content}</div>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default Post;