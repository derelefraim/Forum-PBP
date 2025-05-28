import { authenticateJWT } from '../middleware/Auth'; 
import express from 'express';
import { getAllLikesForPost, getUserLikeStatus, likePost,unlikePost } from '../controller/like'; // Assuming you have a controller for likes

const likeRouter = express.Router();

likeRouter.post('/likePost/:post_id', authenticateJWT, likePost);

likeRouter.delete('/unlikePost/:post_id',authenticateJWT, unlikePost);

likeRouter.get('/getAllLikesForPost/:post_id', /*authenticateJWT,*/ getAllLikesForPost); // get like(s) dari sebuah post

likeRouter.get('/getUserLikeStatus/:post_id', authenticateJWT, getUserLikeStatus); // get like(s) dari semua post
export default likeRouter;