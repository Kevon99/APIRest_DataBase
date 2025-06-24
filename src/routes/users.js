import express from "express"
import { newUser, largeDocuments, findUser } from "../connectionDB/connectionDB.js"
import bcrypt from "bcrypt"

const router = express.Router()


router.use(express.json())


router.post('/register', async (req, res) => {
    try{
        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({
                message: "email and password are requiered. Please try again"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const large = await largeDocuments()

        const user = {email, password:  hashedPassword, id : large + 1}
        const result = await newUser(user)
        res.status(201).json(result)
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

        res.status(200).json({
            message: "Login successful", user : {email: user.email}
        })
    }catch(error){
        res.status(500).json({
            Message : error.message
        })
    }
})


export default router