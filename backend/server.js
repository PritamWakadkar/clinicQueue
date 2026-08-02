import express from 'express'
import cors from 'cors'
import dotenv from "dotenv";
import connectDB from './config/mongodb.js'
import connectCloudnary from './config/cloudnary.js';
import addminRouter from './routes/adminRoutes.js';
import cookieParser from 'cookie-parser';

// app config
const app = express();
dotenv.config();

const port = process.env.PORT

app.use(express.json())
app.use(cors())
app.use(cookieParser());
connectDB()
connectCloudnary()
// api end point

app.use('/api/admin',addminRouter)




app.get('/',(req,res)=>{
    res.send("API Working");
})


app.listen(port,console.log('server started',port))