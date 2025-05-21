const User = require("../models/User");
const bctypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Gendrate JWT Token
const generatrToke =(userId)=>{
    return jwt.sign({id:userId}, process.env.JWT_SECRET, {expiresIn:"7d"});
};

// @desc Regester a new User
// @route POST /api/auth/register;
// @access Public
const registerUser = async (req, res)=>{
    try{
        const {name, email, password, profileImageUrl, adminInvaiteToken} = req.body;

        //Check if user is already exist
        const userExists = await User.findOne({email})
        if(userExists){
            return res.status(400).json({message: "User already exists"})
        }

        //Detarmin user role: Admin if correct  token is provided, otherwize Member
        let role = "member"
        if(adminInvaiteToken && adminInvaiteToken === process.env.ADMIN_INVITE_TOKEN){
            role = "admin"
        }

        //Hash password
        const salt = await bctypt.genSalt(10);
        const hashedPassword = await bctypt.hash(password, salt);

        //Creat New user 
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            profileImageUrl,
            role,
        });

        //Return User Data with JWT
        res.status(201).json({
            _id:user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImgUrl,
            role: user.role,
            token:generatrToke(user._id),
        })

    }catch(error){
        res.status(500).json({message: "Server error", error: error.message})
    }
};

// @desc Login User
// @router Post /api/auth/login
// @access public
const loginUser = async (req, res)=>{
    try{

    }catch(error){
        res.status(500).json({message: "Server error", error: error.message})
    }
}

// @desc Get user profile
// @router GET /api/auth/login
// @acess private (Require JWT)
const getUserProfile = async(req, res)=>{
    try{

    }catch(error){
        res.status(500).json({message: "Server error", error: error.message})
    }
}

// @desc Update UserProfile
// @route PUT/ api/auth/profile
// @access Private (Require JWT)
const updateUserProfile = async(req, res)=>{
    try{

    }catch(error){
        res.status(500).json({message: "Server error", error: error.message})
    }
}

module.exports = {registerUser, loginUser, getUserProfile, updateUserProfile}


