import express from  'express'
import {Login, logout, register} from '../controllers/authControllers.js'
import {checkCookie} from '../middleware/authCookie.js'
import { StatusCodes } from 'http-status-codes'
const router = express.Router()

router.post('/register',register)
router.post('/login',Login)
router.get('/logout',logout)
router.get('/check', checkCookie, (req, res) => {
    const { id, name } = req.user;
  
    res.status(200).json({
      isLoggedIn: true,
      user: {
    id
      },
    });
  });
export default router