import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';


dotenv.config();
const router = express.Router();
router.use(cookieParser());
router.use(express.json());

// verify token middleware
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token){
        return res.status(401).json({ message: 'Access denied. No token provied.' });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    }catch(error){
        return res.status(403).json({ message: 'Invalid token or expired.' });
    }
}

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin'){
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
}


export { verifyToken , isAdmin };
