import { Link } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(""); 
  const [userId, setUserId] = useState(""); 
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/user/getCurrentUser", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        const data = response.data;
        setUsername(data.user.username);
        setUserId(data.user.user_id);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Gagal mengambil data profile.");
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchData();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-5xl-mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-mono text-xl font-bold text-white">
            Forum<span className="text-purple-500">.Mobil</span>
          </Link>
          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/home" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link to="/createpost" className="text-gray-300 hover:text-white transition-colors">Create Post</Link>
            <Link to={`/post/mypost/${userId}`} className="text-gray-300 hover:text-white transition-colors">My Post</Link>
         
          </div>

          {/* Mobile Menu Button*/}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen((prev) => !prev)}
                className="text-gray-300 focus:outline-none"
                aria-label="Toggle Menu">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
              Open
            </button>
          </div>

          {/* Desktop Auth */}
          <div>
            <div onClick={() => navigate("/profile")}>
              {isLoggedIn ? <p>Selamat datang, {username}</p> : <button>Login</button>}
            </div>
          </div>

          {/* Mobile Menu / Links */}
          {menuOpen && (
            <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link to={"/home"}>Home</Link>
                <Link to={"/create"}>Create Post</Link>
                <Link to={`/post/mypost/${userId}`}>My Post</Link>
              
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};




