import { MongoClient } from "mongodb";

// params of database localhost of your machine

const mongoUrl = "mongodb://localhost:27017/prueba"

const getDataBase = async () => {
    try{
        const connection = await MongoClient.connect(mongoUrl)
        return connection.db()
    }catch(error){
        console.error(error)
    }
}


export {getDataBase}