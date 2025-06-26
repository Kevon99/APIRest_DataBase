import express from "express"
import morgan from "morgan"
import routerUser from "./routes/users.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"



dotenv.config()

const app = express()


app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.json())

const PORT = process.env.PORT || 3000;

app.use('/api', routerUser)


app.listen(PORT, () => {
    console.log(`Server Listening on Port ${PORT}`)
})

