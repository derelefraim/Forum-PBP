import express from 'express';
import {createPost, getAllPosts, getPostById, updatePost, deletePost, getPostContent, getPostTitle, getAllVariable, getMyPost} from '../controller/post';
import { authenticateJWT } from '../middleware/Auth'; 
import { Post } from '../../models/post';
import multer from 'multer';
import { Router } from "express";

const postRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });


postRouter.get('', getAllPosts); // udah
postRouter.post('/CreatePost',authenticateJWT, upload.single("image"),createPost); // udah
postRouter.get('/getPostById', authenticateJWT,getPostById);  // udah
postRouter.put('/:postId/updatePost',authenticateJWT, updatePost); // udah 
postRouter.delete('/:postId/deletePost',authenticateJWT, deletePost); // udah
postRouter.get('/:postId/getPostContent', getPostContent); // udah
postRouter.get('/:postId/getPostTitle', getPostTitle); // udah
postRouter.get('/:post_id/getAllVariable', getAllVariable); // baru


postRouter.get('/mypost/:userId', authenticateJWT, getMyPost);

export default postRouter;


