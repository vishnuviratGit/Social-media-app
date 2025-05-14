import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import authroutes from "./routes/auth.js";
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import { verifyToken } from "./middlewares/auth.js";
import {createPost} from "./controllers/posts.js"
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";
import {v2 as cloudinary} from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary";

/*configurations*/
const fileName=fileURLToPath(import.meta.url); //converts file url into the path
const dirName=path.dirname(fileName);  //gets directory path from file path
dotenv.config()   //load environment variables from a .env file into process.env
const app=express();
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
app.use(cors())
//app.use("/assets", express.static(path.join(dirName, "public/assets")));

/*Multer storage*/
// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, "public/assets");
//     },
//     filename: function(req, file, cb){
//         cb(null, file.originalname);
//     }
// })
// const upload= multer({storage})

/*Cloudinary storage*/
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "social_media_uploads",
    allowed_formats: ["jpg", "png", "jpeg"],
    //transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

const upload = multer({ storage });

/*Routes with files*/  //"),
app.post("/auth/register",upload.single("picture"), register)
app.post("/posts", verifyToken, upload.single("picture"), createPost)

app.use("/auth", authroutes)
app.use("/users", userRoutes)
app.use("/posts", postRoutes)
/*Mogoose setup*/
const PORT=process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL)
.then((result)=>{
    app.listen(PORT, ()=>{
        console.log("connected to mongoDB and app is listening at the port")
    })
    // User.insertMany(users)
    // Post.insertMany(posts)
})
.catch((error)=>{
    console.log(`Did not connect to mongoDB due to ${error}`)
})

