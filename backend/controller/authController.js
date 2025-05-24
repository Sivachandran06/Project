const User = require("../models/User");
const bctypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Gendrate JWT Token
const generateToke =(userId)=>{
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
            token:generateToke(user._id),
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
        const {email, password} = req.body

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"Invalid email or password"})
        }

        //Compar Password
        const isMatch = await bctypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid email or Password"})
        }

        //Return User data with JWT
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            toke: generateToke(user._id)
        })
    }catch(error){
        res.status(500).json({message: "Server error", error: error.message})
    }
}

// @desc Get user profile
// @router GET /api/auth/login
// @acess private (Require JWT)
const getUserProfile = async(req, res)=>{
    try{
        const user = await User.findById(req.user.id).selected("-password");
        if(!user){
            return res.status(404).json({message: "user not forund"});
        }
        res.json(user);
    }catch(error){
        res.status(500).json({message: "Server error", error: error.message})
    }
}

// @desc Update UserProfile
// @route PUT/ api/auth/profile
// @access Private (Require JWT)
const updateUserProfile = async(req, res)=>{
    try{
        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updateUser = await user.save();

        res.json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            role: updateUser.role,
            token: generateToke(updateUser._id),
        });

    }catch(error){
        res.status(500).json({message: "Server error", error: error.message})
    }
}

module.exports = {registerUser, loginUser, getUserProfile, updateUserProfile}


