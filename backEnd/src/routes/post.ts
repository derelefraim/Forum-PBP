import express from 'express';
import {createPost, getAllPosts, getPostById, updatePost, deletePost, getPostContent, getPostTitle, getAllVariable} from '../controller/post';
import { authenticateJWT } from '../middleware/Auth'; 

const postRouter = express.Router();

postRouter.get('', getAllPosts); // udah
postRouter.post('/CreatePost', 
   
     createPost); // udah
postRouter.get('/getPostById', 
   
     getPostById);  // udah
postRouter.put('/:postId/updatePost', 
   
     updatePost); // udah 
postRouter.delete('/:postId/deletePost', 
   
     deletePost); // udah
postRouter.get('/:postId/getPostContent', 
   
     getPostContent); // udah
postRouter.get('/:postId/getPostTitle', 
   
     getPostTitle); // udah
     postRouter.get('/:postId/getAllVariable', getAllVariable); // baru
export default postRouter;


