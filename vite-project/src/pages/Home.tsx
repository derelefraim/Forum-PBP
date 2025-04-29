  import React, { useState } from "react";
  import "./Home.css";
  import ferrari from "../assets/ferrari.jpeg";
  import civic from "../assets/civic.jpeg";
  import avanza from "../assets/avanza.jpg";
  import mx5 from "../assets/mx5.jpeg";
  import pajero from "../assets/pajero.jpeg";

  const Home: React.FC = () => {
    const [filter, setFilter] = useState("Semua");
    const [votes, setVotes] = useState<{ [key: number]: number }>({
      1: 23,
      2: 45,
      3: 30,
      4: 15,
      5: 60,
    });

    const posts = [
      {
        id: 1,
        title: "Toyota Avanza 2018 ",
        description: "Mesin suka gerung-gerung , ini kenapa ya?",
        image: avanza,
        comments: 5,
        category: "MPV",
      },
      {
        id: 2,
        title: "Honda Civic Turbo 2020",
        description: "Barusan beli civic turbo second 350jt, worth it gak?",
        image: civic,
        comments: 12,
        category: "Sedan",
      },
      {
        id: 3,
        title: "Mitsubishi Pajero Sport 2022",
        description: "Crash karena mobil limbung banget",
        image: pajero,
        comments: 8,
        category: "SUV",
      },
      {
        id: 4,
        title: "Ferrari 488 GTB 2021",
        description: "Titik kumpul di MCD, only ferrari drivers",
        image: ferrari,
        comments: 15,
        category: "Supercar",
      },
      {
        id: 5,
        title: "Mazda MX-5 Miata 2019",
        description: "Sportcar affordable nih, ngumpul yuk",
        image: mx5,
        comments: 6,
        category: "Sportcar",
      },
    ];

    const handleVote = (id: number, type: "up" | "down") => {
      setVotes((prevVotes) => ({
        ...prevVotes,
        [id]: type === "up" ? prevVotes[id] + 1 : Math.max(prevVotes[id] - 1, 0),
      }));
    };

    const filteredPosts =
      filter === "Semua"
        ? posts
        : posts.filter((post) => post.category === filter);

    return (
      <div className="forum-home">
        <header className="navbar">
          <h1 className="logo">Forum Mobil</h1>
          <nav className="nav-links">
            <a href="#">Forum</a>
            <a href="#">Search</a>
            <a href="#">Buat Postingan</a>
            <a href="#">Masuk / Daftar</a>
          </nav>
        </header>

        <main className="forum-content center-container">
          <div className="filter-section">
            <h2 style={{ color: "black" }}>Forum</h2>
            <select
              className="filter-dropdown"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="Semua">Semua Kategori</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="MPV">MPV</option>
              <option value="Supercar">Supercar</option>
              <option value="Sportcar">Sportcar</option>
            </select>
          </div>

          {filteredPosts.map((post) => (
            <div className="forum-post" key={post.id}>
              <div className="post-content">
                <img src={post.image} alt="Mobil" className="post-image" />
                <div className="post-details">
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
              
                  <div className="post-actions">
                    <a href="#">💬 {post.comments} Komentar</a>
                    <a href="#" className="detail-link">Lihat Detail</a>
                    <div className="vote-section">
                      <button
                        className="vote-button"
                        onClick={() => handleVote(post.id, "up")}
                      >
                        ⬆
                      </button>
                      <span className="total-votes">{votes[post.id]}</span>
                      <button
                        className="vote-button"
                        onClick={() => handleVote(post.id, "down")}
                      >
                        ⬇
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </main>

        <footer className="footer">
          &copy; 2025 MobilLelangForum. All rights reserved.
        </footer>
      </div>
    );
  };

  export default Home;
