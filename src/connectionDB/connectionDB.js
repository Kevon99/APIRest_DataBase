import { getDataBase } from "../config.js";


const largeDocuments = async () => {
    try{
        const db = await getDataBase()
        const getlarge = await db.collection('usuarios').countDocuments()
        return getlarge
    }catch(error){
        console.error(`Error making a count of documents of users `, error)
    }
}

 const createUser = async (user) => {
    try{
        const db = await getDataBase()
        const result = await db.collection('usuarios').insertOne(user)
        if(!result.insertedId) return null
        return await db.collection('usuarios').findOne({_id: result.insertedId})
    }catch(error){
        console.error(`Error making a new user ${JSON.stringify(user)}:`, error)
        return null
    }
 }

const findUser = async (user) => {
    try{
        const db = await getDataBase()
        const found = await db.collection('usuarios').findOne(user)
        return found
    }catch(error){
        console.error(`Error looking for user with filter ${JSON.stringify(user)}:`, error)
        return null
    }
}





export {createUser, largeDocuments, findUser, }