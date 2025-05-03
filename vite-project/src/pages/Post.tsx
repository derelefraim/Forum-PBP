import { useParams } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
const Post: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  interface PostObject {
    title: string;
    content: string;
    user_id: number;
    created_at: string;
    updated_at: string;
    username: string;
  }

  const [post, setPost] = useState<PostObject | null>(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/post/${id}`).then((response) => {
      setPost(response.data);
    });
  }, []);

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          {post && (
            <>
              <div className="title"> {post.title} </div>
              <div className="body"> {post.content} </div>

              <div className="footer">Posted By : {post.username}</div>
              <div className="footer"> {post.created_at} </div>
              <div className="footer"> {post.updated_at} </div>
            </>
          )}
        </div>
      </div>

      <div className="rightSide"> Comments </div>
    </div>
  );
};

export default Post;
