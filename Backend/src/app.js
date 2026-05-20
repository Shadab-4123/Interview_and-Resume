const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')



const app = express()


// Middleware to parse JSON bodies 
// server ko initiate(instance creation) karna aur
//  routes ko define karna ke beech mein middleware use karna zaroori hai,
//  taki jab bhi koi request aaye toh uska body parse ho jaye aur hum usko easily access kar sakein. 
app.use(express.json()) 
app.use(cookieParser())
app.use(cors({
    origin:'http://localhost:5173', // frontend ka URL
    credentials:true // cookies ko allow karne ke liye
}))

// Importing and using routes
const authRouter = require('./routes/auth.routes')

// use the authRouter for all routes starting with /api/auth
app.use('/api/auth', authRouter)


module.exports = app