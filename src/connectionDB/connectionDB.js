import { getDataBase } from "../config.js";


const largeDocuments = async () => {
    const db = await getDataBase()
    const getlarge = await db.collection('usuarios').countDocuments()
    return getlarge
}

 const newUser = async (user) => {
    const db = await getDataBase()
    const makeUser = await db.collection('usuarios').insertOne(user)
    return makeUser
 }

export {newUser, largeDocuments}