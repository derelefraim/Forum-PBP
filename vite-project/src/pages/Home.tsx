import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import { useNavigate } from 'react-router';

interface Posts {
  id: number;
  title: string;
  content : string;
  user_id: number;
  created_at: string;
  updated_at: string;
  username: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Posts[]>([]);

  useEffect(() => {
   axios.get('http://localhost:3001/posts')
      .then((response) => {
        setPosts(response.data);
      });
  }, []);

  return (
    <div className="p-4">
      {posts.map((post) => (
        <div className='post' onClick={() => navigate(`/post/${post.id}`)} >
  
          <div className='title'> {post.title} </div>
          <div className='body'> {post.content} </div>
            <div className='footer'>
            Posted By : {post.username} 
          </div>
          <div className='footer'> {post.created_at} </div>
          <div className='footer'> {post.updated_at} </div>
          
        </div>
      ))}
    </div>
  );
};

export default Home;
