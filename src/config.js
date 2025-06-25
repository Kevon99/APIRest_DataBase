import { MongoClient } from "mongodb";
import dotenv from "dotenv";


dotenv.config();



const mongoUrl = process.env.DATABASE_URL || "mongodb://localhost:27017/prueba";

const getDataBase = async () => {
    try{
        const connection = await MongoClient.connect(mongoUrl)
        return connection.db()
    }catch(error){
        console.error(error)
    }
}



export {getDataBase}