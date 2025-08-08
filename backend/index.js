import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import router from './routes/productRoutes.js'
import cors from 'cors'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()

app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')))

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

// Mount all routes (products, stock, order, customer, return) under /api/v1
app.use('/api/v1', router)

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log(`MongoDb Connnected Successfully!`)
})
.catch((err)=>{
  console.error(`Error Connecting MongoDb: ${err}`)
})

const PORT = process.env.PORT

app.listen(PORT, () =>{
  console.log(`Server Running on PORT ${PORT}`)
})