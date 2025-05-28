import Login from "./pages/login";
import Home from "./pages/home";
import Post from "./pages/post";
import CreatePost from "./pages/createPost";
import Register from "./pages/register";
import Profile from "./pages/profile";
import EditProfile from "./pages/editProfile";
import MyPost from "./pages/mypost";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


const App = () => {
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
        <Route path="/post/mypost/:userId" element={<MyPost />} />
      </Routes>
    </Router>
  );
};

export default App;