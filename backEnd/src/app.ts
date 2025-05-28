import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user';
import postRouter from './routes/post';
import likeRouter from './routes/like';
import commentRouter from './routes/comments';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user';
import { Post } from '../models/post';
import { Like } from '../models/like';
import { Comment } from '../models/comment';

const config = require('../config/config.json');
const app = express();
const sequelize = new Sequelize({
  ...config.development,
  models: [User, Post, Like, Comment]
});

// Konfigurasi CORS yang benar
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

sequelize.authenticate()
  .then(() => console.log('Database connected successfully!'))
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  next();
});

// Router API
app.use('/user', userRoutes);
app.use('/post', postRouter);
app.use('/like', likeRouter);
app.use('/comment', commentRouter);
app.use('/uploads', express.static('uploads'))

// Middleware error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
