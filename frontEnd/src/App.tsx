import Login from "./pages/login";
import Home from "./pages/home";
import Post from "./pages/post";
import CreatePost from "./pages/createPost";
import Register from "./pages/register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


const app = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/post/:postId" element={<Post />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default app;