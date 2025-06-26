import { getDataBase } from "../config.js";
import { ObjectId } from 'mongodb';


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


// find all users

const findAllUsers = async () => {
    try{
        const db = await getDataBase()
        const found = await db.collection('usuarios').find({}, {projection : {email: 1, role: 1, _id: 1}}).toArray()
        return found.map(found => ({
            email: found.email,
            role: found.role,
            _id: found._id.toString()
        }))
    }catch(error){
        console.error(`Error looking for all users:`, error)
        return null
    }
}

const updateUser = async (userId, newData) => {
    try{
        const db = await getDataBase()
        const id = new ObjectId(userId)


        const result = await db.collection('usuarios').updateOne(
            {_id: id},
            {$set: newData}
        )
        if(result.modifiedCount === 0) return null
        return await db.collection('usuarios').findOne({_id: id})
    }catch(error){
        console.error(`Error updating user with id ${userId}:`, error)
        return null
    }
}

const deleteUser = async (userEmail) => {
    try{
        const db = await getDataBase()
        const result = await db.collection('usuarios').deleteOne({email: userEmail})
        if(result.deletedCount === 0) return null
        return {message: `User with email ${userEmail} deleted successfully`}

}catch(error){
        console.error(`Error deleting user with email ${userEmail}:`, error)
        return null
    }
}

export {createUser, findUser,  findAllUsers, updateUser, deleteUser} 