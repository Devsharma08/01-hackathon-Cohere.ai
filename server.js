import express from 'express'
import { config } from 'dotenv' 
config()
import morgan from 'morgan'
import mongoose from 'mongoose'

import { StatusCodes } from 'http-status-codes'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRouter.js'
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js'
import chatRouter from './routes/chatRouter.js'
import cors from "cors";

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser('secret'))
// app.use('/',(req,res)=>{
//     res.status(StatusCodes.OK).json({msg :"hello world!!"})
// })

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true // 👈 THIS allows cookies to be sent
}));
app.use('/api/v1',authRouter)
app.use('/api/v1',chatRouter)
app.use(errorHandlerMiddleware)
const port =  process.env.PORT || 5173
const start = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        app.listen(port,()=>{
            console.log(`Server is listening on ${port}.....`);
        })
    } catch (error) {
        console.log(error);
    }
}
start()
 
