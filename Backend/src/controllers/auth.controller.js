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
}logoutUserController   



/** * @name logoutUserController
 * @desc clear the token cookie to logout user and add the token to blacklist
 * @route GET /api/auth/logout
 * @access Public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token
    if (!token) {
        return res.status(400).json({ message: 'No token found' })
    }

    // token ko blacklist mein add karna hai
    const blacklistTokenModel = require('../models/blacklist.model')
    const blacklistedToken = new blacklistTokenModel({ token })
    await blacklistedToken.save()

    res.clearCookie('token')
    res.status(200).json({ message: 'User logged out successfully' })
}

/**
 * @name getMeController
 * @desc Get the logged in user's details, expecting token in cookies
 * @route GET /api/auth/get-me
 * @access Private
 */
async function getMeController(req,res){
    const user = await userModel.findById(req.user.id)
    if(!user){
        return res.status(404).json({message:'User not found'})
    }
    console.log('User details:', user) // Debugging log
    res.status(200).json({
        message:'User details fetched successfully',
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports = {registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}