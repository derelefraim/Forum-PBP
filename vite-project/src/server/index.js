// server/index.js (ESM style)
import express from 'express';
import cors from 'cors';
import { Client } from 'pg';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


const client = new Client({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: 'changeme',
  database: 'forum_mobil',
});

client.connect();









app.get('/users', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/posts', async (req, res) => {
    try {
        const result = await client.query(
            'SELECT posts.id, posts.title, posts.content, posts.user_id, posts.likes, posts.created_at, posts.updated_at, users.username ' +
            'FROM posts ' +
            'JOIN users ON posts.user_id = users.id'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

app.get('/post/:id', async (req, res) => {
    const postId = req.params.id;
    try {
        const result = await client.query(
            'SELECT posts.id, posts.title, posts.content, posts.user_id, posts.likes, posts.created_at, posts.updated_at, users.username ' +
            'FROM posts ' +
            'JOIN users ON posts.user_id = users.id ' +
            'WHERE posts.id = $1', 
            [postId]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});



app.post('/posts', async (req, res) => {
    const { title, content, user_id, likes } = req.body;
    try {
      const result = await client.query(
        'INSERT INTO posts (title, content, user_id, likes) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, content, user_id, likes]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create post' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
