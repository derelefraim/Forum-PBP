import express from 'express';
import {login,register,getAllUser, getUserById, updateUser} from '../controller/user';
import { authenticateJWT } from '../middleware/Auth'; 

const userRouter = express.Router();
userRouter.post('/login', login) // aman
userRouter.post('/register', register) // aman
userRouter.put('/update',authenticateJWT, updateUser)
userRouter.get('/getAllUser', authenticateJWT, getAllUser) // aman 
userRouter.get('/getCurrentUser', authenticateJWT, getUserById) // aman
export default userRouter;

