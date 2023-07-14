const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// user model to interact with mongodb database
const User = require("../models/userModel")
// @desc register a user
// @route post /api/users/register
// @access public

const registerUser = asyncHandler(async (req, res) => {
    const { username,email,password} = req.body
    if(!username || !email || !password){
        res.status(400)
        throw new Error("All fields are mandatory")
    }

    // before creating a user we will check that whether we have an existing user or not
    const userAvailable = await User.findOne({email})
    if(userAvailable){
        res.status(400)
        throw new Error("User already registered")
    }


    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("Hashed password:", hashedPassword)
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    })

    // whenever we want to send the info to the user...i dont ant to send the password
    if(user){
        res.status(201).json({_id: user.id, email: user.email})
    }else{
        res.status(400)
        throw new Error("User data is not valid")
    }

    console.log(`User created ${user}`)

    res.json({message: "Register the user"})
})

// @desc login a user
// @route post /api/users/login
// @access public

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        res.status(400)
        throw new Error("All fields are mandatory")
    }

    // if we have a proper email and password then we need to find that whether there is a user in database or not
    const user = await User.findOne({ email })
    // compare password with hashed password
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            // payload
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            },
        }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m"}
        )
        res.status(200).json({accessToken})
    }else{
        res.status(401)
        throw new Error("email  or password not valid")
    }
    
})

// @desc current user info
// @route post /api/users/current
// @access private

const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user)
})



module.exports = {registerUser, loginUser, currentUser}