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
      title: "Toyota Avanza 2018 Siap Lelang!",
      description: "Kondisi mulus, pajak hidup. Mulai dari Rp100.000.000!",
      image: avanza,
      timeLeft: "02:12:33",
      comments: 5,
      category: "MPV",
    },
    {
      id: 2,
      title: "Honda Civic Turbo 2020",
      description: "Mobil langka, kilometer rendah, lelang mulai besok!",
      image: civic,
      timeLeft: "1 Hari Lagi",
      comments: 12,
      category: "Sedan",
    },
    {
      id: 3,
      title: "Mitsubishi Pajero Sport 2022",
      description: "SUV tangguh dan nyaman, siap lelang!",
      image: pajero,
      timeLeft: "3 Jam Lagi",
      comments: 8,
      category: "SUV",
    },
    {
      id: 4,
      title: "Ferrari 488 GTB 2021",
      description: "Supercar bertenaga, jarang ada, segera ikut lelang!",
      image: ferrari,
      timeLeft: "5 Jam Lagi",
      comments: 15,
      category: "Supercar",
    },
    {
      id: 5,
      title: "Mazda MX-5 Miata 2019",
      description: "Sportcar ringan dan cepat, cocok untuk penggemar kecepatan!",
      image: mx5,
      timeLeft: "7 Jam Lagi",
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
        <h1 className="logo">MobilLelangForum</h1>
        <nav className="nav-links">
          <a href="#">Forum</a>
          <a href="#">Lelang Aktif</a>
          <a href="#">Buat Postingan</a>
          <a href="#">Masuk / Daftar</a>
        </nav>
      </header>

      <main className="forum-content center-container">
        <div className="filter-section">
          <h2 style={{ color: "black" }}>Forum Lelang Mobil</h2>
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
                <p className="time-left">Berakhir dalam: {post.timeLeft}</p>
                <div className="post-actions">
                  <a href="#">💬 {post.comments} komentar</a>
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
