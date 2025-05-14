import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

/*Register User*/
export const register= async(req, res)=>{
    try{
       const{firstName, lastName, email, password, friends, location, occupation}=req.body;
       const picturePath = req.file?.path;
       const salt= await bcrypt.genSalt()
       const hashedPassword= await bcrypt.hash(password, salt);
       const newUser = new User({firstName, lastName, email, password: hashedPassword, 
        picturePath, friends, location, occupation, viewedProfile: Math.floor(Math.random()*10000), impressions: Math.floor(Math.random()*10000)})
       const result= await newUser.save()
       return res.status(201).json(result)
    }
    catch(error){
       return res.status(500).json({error: error.message})
    }
}

/*logging in*/ 
export const login= async(req, res)=>{
     try{
        const{email, password}=req.body;
        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(400).json({msg: "user doesnot exist"})
        }
        const matchPassword= await bcrypt.compare(password, existingUser.password);
        if(!matchPassword){
            return res.status(400).json({msg: "Invalid credentials"})
        }
        const token = jwt.sign({id: existingUser._id}, process.env.JWT_SECRET);
        
        return res.status(200).json({token, existingUser})
     }
     catch(error){
        return res.status(500).json({error: error.message})
     }
}