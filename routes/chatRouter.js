import express from 'express'
import { continueChat, createChat, createNewChat, deleteHistory, getHistory } from '../controllers/chatControllers.js'
import { UnauthenticatedError } from '../Errors/customError.js'
// import {check} from '../middleware/authCookie.js'
import jwt from 'jsonwebtoken'; // added jwt import
const router = express.Router()
router.post('/chat/:id/',createChat)
router.get('/chat/history/:id',getHistory)
router.delete('/chat/delete/:id',deleteHistory)
router.get('/chat/new/:id',createNewChat)
router.patch('/chat/update/:id',continueChat)
// router.get('/get', check, (req, res) => {
//     const payload = req.user1;
  
//     res.status(200).json({
//       isLoggedIn: true,
//       payload,
//     });
//   })
export default router