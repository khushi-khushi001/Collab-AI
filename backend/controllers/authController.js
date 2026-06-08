const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User.js");

// signup
const signupUser = async(req, res) => {
    try {
        const {name, email, password} = req.body;

        // check existing user
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exist"});
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create user
        const user = await User.create({name, email, password: hashedPassword});

        res.status(201).json({message: "User Registered Successfully", user});
    } catch (error) {
        res.status(500).json({message: "Signup failed",
            error: error.message
        });
    }
};


// login 
const loginUser = async (req, res) => {
    try {
    
        const {email, password} = req.body;

        // find user
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "Invaild Email"});
        }

        // compare password 
        const isMatch = await bcrypt.compare(password, user.password);
        

        if(!isMatch) {
            return res.status(400).json({message: "Invalid Password"});
        }

        // create token 
        const token = jwt.sign(
            {
              id: user._id
           },
           process.env.JWT_SECRET,

           {
            expiresIn: "7d"
           }
        );

        res.status(200).json({message: "Login Successfull", token, user});
    } catch (error) {
        res.status(500).json({
            message: "Login Failed!",
            error: error.message
        });
    }
};

module.exports = {signupUser, loginUser};