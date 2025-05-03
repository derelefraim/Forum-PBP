import { Navbar } from "./components/Navbar.tsx";
import Home from "./pages/Home.tsx";
import { Route, Routes } from "react-router";
import CreatePostPage from "./pages/CreatePostPage.tsx";
import Post from "./pages/Post.tsx";
function App() {
  return(
  <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20">
    <Navbar/>
    <div className="container mx-auto px-4 py-6">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/createpost" element={<CreatePostPage/>} />
        <Route path="/post/:id" element={<Post/>} />

      </Routes>
    </div>
  </div>
  )};

export default App;
