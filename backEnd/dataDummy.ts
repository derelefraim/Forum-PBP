import { Sequelize } from "sequelize-typescript";
import { User } from "./models/user";
import { Post } from "./models/post";
import { Comment } from "./models/comment";
import { Like } from "./models/like";
import { v4 as uuidv4 } from "uuid";

const config = require("./config/config.json");

const sequelize = new Sequelize({
  ...config.development,
  models: [User, Post, Comment, Like],
});

async function createDummyData() {
  try {
    await sequelize.sync();

    // Users
    const user1 = await User.create({
      user_id: uuidv4(),
      username: "alice",
      email: "alice@example.com",
      password: "hashedpassword1",
    });

    const user2 = await User.create({
      user_id: uuidv4(),
      username: "bob",
      email: "bob@example.com",
      password: "hashedpassword2",
    });

    // Posts
    const post1 = await Post.create({
      post_id: uuidv4(),
      title: "My First Post",
      content: "Hello, this is my first post!",
      user_id: user1.user_id,
      image_url: "https://example.com/image1.jpg",
      category: "Teknis",
    });

    const post2 = await Post.create({
      post_id: uuidv4(),
      title: "Another Day, Another Post",
      content: "Nice to meet you all!",
      user_id: user2.user_id,
      image_url: "https://example.com/image2.jpg",
      category: "General",
    });

    const posts = [
      {
        post_id: uuidv4(),
        title: "Tips Merawat Mobil",
        content: "Berikut adalah beberapa tips untuk merawat mobil agar tetap awet.",
        user_id: user1.user_id,
        image_url: "https://example.com/car1.jpg",
        category: "Teknis",
      },
      {
        post_id: uuidv4(),
        title: "Mobil Terbaru 2025",
        content: "Lihat daftar mobil terbaru yang dirilis tahun ini.",
        user_id: user2.user_id,
        image_url: "https://example.com/car2.jpg",
        category: "Entertain",
      },
      {
        post_id: uuidv4(),
        title: "Panduan Membeli Mobil Bekas",
        content: "Tips dan trik untuk membeli mobil bekas dengan harga terbaik.",
        user_id: user1.user_id,
        image_url: "https://example.com/car3.jpg",
        category: "Marketplace",
      },
      {
        post_id: uuidv4(),
        title: "Rekomendasi Mobil Keluarga",
        content: "Mobil keluarga terbaik untuk perjalanan jauh.",
        user_id: user2.user_id,
        image_url: "https://example.com/car4.jpg",
        category: "General",
      },
      {
        post_id: uuidv4(),
        title: "Modifikasi Mobil Sport",
        content: "Inspirasi modifikasi mobil sport untuk tampilan yang lebih keren.",
        user_id: user1.user_id,
        image_url: "https://example.com/car5.jpg",
        category: "Teknis",
      },
      {
        post_id: uuidv4(),
        title: "Event Pameran Mobil",
        content: "Informasi tentang pameran mobil yang akan datang.",
        user_id: user2.user_id,
        image_url: "https://example.com/car6.jpg",
        category: "Entertain",
      },
      {
        post_id: uuidv4(),
        title: "Jual Beli Mobil Online",
        content: "Platform terbaik untuk jual beli mobil secara online.",
        user_id: user1.user_id,
        image_url: "https://example.com/car7.jpg",
        category: "Marketplace",
      },
      {
        post_id: uuidv4(),
        title: "Sejarah Mobil Klasik",
        content: "Mengenal sejarah mobil klasik yang legendaris.",
        user_id: user2.user_id,
        image_url: "https://example.com/car8.jpg",
        category: "General",
      },
      {
        post_id: uuidv4(),
        title: "Perbandingan Mobil Listrik",
        content: "Mana yang lebih baik? Tesla atau Hyundai Ioniq?",
        user_id: user1.user_id,
        image_url: "https://example.com/car9.jpg",
        category: "Teknis",
      },
      {
        post_id: uuidv4(),
        title: "Film dengan Mobil Ikonik",
        content: "Daftar film yang menampilkan mobil ikonik.",
        user_id: user2.user_id,
        image_url: "https://example.com/car10.jpg",
        category: "Entertain",
      },
    ];

    // Create posts
    for (const post of posts) {
      await Post.create(post);
    }

    // Comments
    const comment1 = await Comment.create({
      comment_id: uuidv4(),
      content: "Great post!",
      user_id: user2.user_id,
      post_id: post1.post_id,
      parent_comment_id: null,
    });

    const comment2 = await Comment.create({
      comment_id: uuidv4(),
      content: "Thank you!",
      user_id: user1.user_id,
      post_id: post1.post_id,
      parent_comment_id: null,
    });

    const comment3 = await Comment.create({
      comment_id: uuidv4(),
      content: "You are welcome!",
      user_id: user2.user_id,
      post_id: post1.post_id,
      parent_comment_id: null,
    });

    // Likes
    await Like.create({
      like_id: uuidv4(),
      user_id: user1.user_id,
      post_id: post2.post_id,
    });

    await Like.create({
      like_id: uuidv4(),
      user_id: user2.user_id,
      post_id: post1.post_id,
    });

    console.log("Dummy data created");
  } catch (error) {
    console.error("Unable to create dummy data:", error);
  } finally {
    await sequelize.close();
  }
}

createDummyData();

