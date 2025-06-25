import express from "express"
import { createUser, findUser} from "../connectionDB/connectionDB.js"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"


dotenv.config()

const router = express.Router()


router.use(express.json())


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


        res.status(200).json({
            message: "Login successful",
            token,
            user : {
                email: user.email,
                role: user.role
            }
        })
    }catch(error){
        res.status(500).json({
            Message : error.message
        })
    }
})


export default router