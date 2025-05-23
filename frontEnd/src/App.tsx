import Login from "./pages/login";
import Home from "./pages/home";
import Post from "./pages/post";
import CreatePost from "./pages/createPost";
import Register from "./pages/register";
import Profile from "./pages/profile";
import EditProfile from "./pages/editProfile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


const app = () => {
  return (
    <Router>
      <Routes>
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/post/:post_id" element={<Post />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default app;