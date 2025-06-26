import express from "express"
import { createUser, findUser, findAllUsers, updateUser, deleteUser} from "../connectionDB/connectionDB.js"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import { verifyToken , isAdmin} from "./middleWares.js"


dotenv.config()

const router = express.Router()


router.use(cookieParser())
router.use(express.json())

// Router post for user registration
// It will create a new user with email, password and role
// If the user is an admin, it will check the admin code

router.post('/register', async (req, res) => {
    try{
        const {email, password, admincode} = req.body

        if(!email || !password){
            return res.status(400).json({
                message: "email and password are requiered. Please try again"
            })
        }
        const existingUser = await findUser({email})

        if(existingUser){
            return res.status(409).json({
                message: "User already exists. Please try again"
            })
        }   

        let role = "user"
        if(admincode && admincode == process.env.ADMIN_PASSWORD){
            role = "admin"
        }else if(admincode && admincode !== process.env.ADMIN_PASSWORD){
            return res.status(401).json({
                message: "Invalid admin code. Please try again"
            })
        }     

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = {email, password:  hashedPassword, role}

        const result = await createUser(user)

        if(!result){
            return res.status(500).json({
                message: "Error creating user. Please try again"
            })
        }

        res.status(201).json({
            message: "User created successfully",
            user: {
                email: result.email,
                role: result.role
            }
        })
    }catch(error){
        res.status(500).json({
            Message : "Error validating the user"
        })
    }
})

// Router post for user login
// It will check if the user exists and if the password is correct
// If the user is found, it will return a JWT token

router.post('/login', async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email, !password){
            res.status(400).json({
                message: "Email and password required"
            })
        }

        const user = await findUser({email})
        
        if(!user){
            return res.status(401).json({
                message: "User not found. Please try again"
            })
        }

        const isValid = await bcrypt.compare(password, user.password);

        if(!isValid){
            return res.status(401).json({
                message: " The password was not correct, try again"
            })
        }

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            sameSite: "Strict",
            maxAge: 3600000  
        })

        res.status(200).json({
            message: "user logged in successfully",
        })

    }catch(error){
        res.status(500).json({
            Message : "error validating the user", error
        })
    }
})


// get profile of the user

router.get('/profile', verifyToken, async (req, res) => {
    const {userId, email, role} = req.user;

    res.json({
        message : "User profile retrieved successfully",
        user: {
            userId,
            email,
            role
        }
    })
});

// get all users from admin

router.get('/users', verifyToken, isAdmin, async (req, res) => {
    try{
        const users = await findAllUsers();
        if(!users){
            return res.status(404).json({
                message: "No users found"
            })
        }
        res.status(200).json({
            message: "Users retrieved successfully",
            users
        })
    }catch(error){
        res.status(500).json({
            message: "Error retrieving users",
            error
        })
    }
});


// update user password

router.put('/update-password', verifyToken, async (req, res) => {
    try{
        const {userId, email} = req.user;
        const {oldPassword, newPassword} = req.body;

        if(!oldPassword || !newPassword){
            return res.status(400).json({
                message: "Old password and new password are required"
            })
        }

        if(newPassword.length < 8){
            return res.status(400).json({
                message: "New password must be at least 8 characters long" 
            })
        }

        const user = await findUser({email : email});

        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }

        const isValid = await bcrypt.compare(oldPassword, user.password);

        if(!isValid){
            return res.status(401).json({
                message: "Old password is incorrect"
            })
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        
        user.password = hashedNewPassword;

        // Update the user in the database
        const updatedUser = await updateUser(userId, {password: hashedNewPassword}); 

        if(!updatedUser){
            return res.status(500).json({
                message: "Error updating password"
            })
        }

        res.status(200).json({
            message: "Password updated successfully"
        })

    }catch(error){
        res.status(500).json({
            message: "Error updating password",
            error
        })
    }
});


router.delete('/logout', verifyToken, (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    })
});

// ban an user by admin

router.delete('/ban', verifyToken, isAdmin, async (req, res) => {
    try{
        const {userEmail} = req.body;
        if(!userEmail){
            return res.status(400).json({
                message: "User email is required"
            })
        }
        const user = await findUser({email: userEmail});
        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }

        const result = await deleteUser(userEmail);
        if(!result){
            return res.status(500).json({
                message: "Error banning user"
            })
        }

        res.status(200).json({
            message: "User banned successfully",
            result
        })
        
    }catch(error){
        res.status(500).json({
            message: "Error banning user",
            error
        })
    }
})

export default router