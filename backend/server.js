import express from "express";
import path from "path";
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import cookieParser from "cookie-parser";
import {notFound, errorHandler} from './middleware/errorMiddleware.js'
import ServerlessHttp from "serverless-http";
import dotenv from 'dotenv'
dotenv.config()
import connectDB from "./config/db.js";
import router from "./routes/productRoutes.js";
connectDB()
const port = process.env.PORT || 5000;
const app = express();

 
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.get('/api/config/paypal', (req, res)=> res.send({
    clientId: process.env.PAYPAL_CLIENT_ID
}))
app.use('/api/upload', uploadRoutes)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.get('/',(req,res)=>{
    res.send('Api running...')
})
app.use(notFound)
app.use(errorHandler)

app.listen(port, ()=> console.log(`Server running on port ${port}`))

app.use('/.netlify/functions/api', router)

module.exports.handler = ServerlessHttp(app)