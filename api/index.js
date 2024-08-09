import express from "express";
import path from "path";
import productRoutes from '../backend/routes/productRoutes.js'
import userRoutes from '../backend/routes/userRoutes.js'
import orderRoutes from '../backend/routes/orderRoutes.js'
import uploadRoutes from '../backend/routes/uploadRoutes.js'
import cookieParser from "cookie-parser";
import {notFound, errorHandler} from '../backend/middleware/errorMiddleware.js'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from "../backend/config/db.js";
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
app.use(express.static(path.join( 'backend' ,'public')))

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
app.use((req, res, next)=>{
    res.sendFile(path.ressolve(__dirname, 'backend','public', 'index.html'))
})

app.get('/',(req,res)=>{
    res.send('Api running...')
})
app.use(notFound)
app.use(errorHandler)

app.listen(port, ()=> console.log(`Server running on port ${port}`))