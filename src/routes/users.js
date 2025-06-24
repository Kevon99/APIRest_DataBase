import express from "express"
import { newUser, largeDocuments } from "../connectionDB/connectionDB.js"

const router = express.Router()


router.use(express.json())


router.post('/register', async (req, res) => {
    try{
        const body = req.body
        const large = await largeDocuments()

        const user = {...body, id : large + 1}
        const result = await newUser(user)
        res.status(201).json(result)
    }catch(error){
        res.status(500).json({
            Message : "Error",
            error: error.message
        })
    }
})


export default router