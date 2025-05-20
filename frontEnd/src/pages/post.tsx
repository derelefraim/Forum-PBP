import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface PostObject {
  title: string;
  content: string;
  user_id: number;
  createdAt: string;
  updatedAt: string;
  user  : {
  username: string;
  };
  likes: number;
}

const Post: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();

  const [post, setPost] = useState<PostObject | null>(null);

  useEffect(() => {
    if (!postId) return; 

    axios.get(`http://localhost:3000/post/${postId}/getAllVariable`)
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch post:", error);
      });
  }, [postId]); 

  return (
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
              <div className="footer">Likes: {post.likes}</div>
            </>
          ) : (
            <div>Loading post...</div>
          )}
        </div>
      </div>

      <div className="rightSide">Comments</div>
    </div>
  );
};

export default Post;
