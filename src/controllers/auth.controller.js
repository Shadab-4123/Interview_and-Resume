const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


/**
 * @name registerUser
 * @desc register a new user,expecting username,email and password in the request body
 * @route POST /api/auth/register
 * @access Public
 */
async function registerUserController(req, res) {

    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const isUserAlreadyExist = await userModel.findOne({ $or: [{ username }, { email }] })

    if (isUserAlreadyExist) {
        return res.status(400).json({ message: 'Username or email already exists' })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = new userModel({ username, email, password: hash })
    await user.save()

    // token generate karne ke liye humein user ki id chahiye hoti hai, jo ki tabhi milti hai jab user database mein save ho jata hai.
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.cookie('token', token)
    res.status(201).json({ message: 'User registered successfully', 
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
     })

}

/**
 * @name loginUserController
 * @desc login user, expecting email and password in the request body
 * @route POST /api/auth/login
 * @access Public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' })
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
        return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.cookie('token', token)
    res.status(200).json({ message: 'User logged in successfully', 
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
     })
}

module.exports = {registerUserController,
    loginUserController
}