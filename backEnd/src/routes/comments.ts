import express from 'express';
import { authenticateJWT } from '../middleware/Auth';
import { createComment, getCommentsByPostId, getCommentById, updateComment, deleteComment } from '../controller/comment';

const commentRouter = express.Router();
commentRouter.get('/getComment/:post_id', getCommentsByPostId); 
commentRouter.get('/getCommentById', authenticateJWT, getCommentById); 
commentRouter.post('/createComment', authenticateJWT, createComment); 
commentRouter.put('/updateComment/:comment_id', authenticateJWT, updateComment); 
commentRouter.delete('/:comment_id/deleteComment', authenticateJWT, deleteComment); 
export default commentRouter;
