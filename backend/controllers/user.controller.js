import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import Post from "../models/posts.model.js";
import crypto from "crypto";

import bcrypt from "bcrypt"
import PDFDocument from "pdfkit";
import fs  from "fs";
import ConnectionRequest from "../models/connectionmodel.js";
import Comment from "../models/comments.model.js";
import mongoose from "mongoose";
import user from "../models/user.model.js"
import connectionRequest from "../models/connectionmodel.js";





// import { loadEnvFile } from "process";

const convertUserDataToPDF = async (userData) =>{
    const docs = new PDFDocument();

    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + outputPath);

    docs.pipe(stream);

    docs.image(`uploads/${userData.userId.profilePicture}`, {align: "center", width: 100});
    docs.fontSize(14).text(`Name: ${userData.userId.name}`);
    docs.fontSize(14).text(`Username: ${userData.userId.username}`);
    docs.fontSize(14).text(`Email: ${userData.userId.email}`);
    docs.fontSize(14).text(`Bio: ${userData.bio}`);
    docs.fontSize(14).text(`Current Position: ${userData.currentPost}`);

    docs.fontSize(14).text("Past Work: ")
    userData.pastWork.forEach((work, index) =>{
        docs.fontSize(14).text(`Company Name: ${work.company}`);
        docs.fontSize(14).text(`Position: ${work.position}`);
        docs.fontSize(14).text(`Years: ${work.years}`);
    })
    docs.end();
    return outputPath;

}

export const register = async (req,res) =>{

    try{
        const {name,email,password,username} = req.body;

        if(!name || !email || !password || !username) return res.status(400).json({message: "All fields are required"});

        const user = await User.findOne({email});

        if(user) return res.status(400).json({message: "User already exists"});

        const hashPassword = await bcrypt.hash(password,10);
        
        const newUser = new User({
            name,
            email,
            password: hashPassword,
            username
        });
        
        await newUser.save();

        const profile = new Profile({ userId: newUser._id });
        await profile.save();

        return res.json({message: "User registered successfully"});

    } catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const login = async (req,res) =>{
    try{
        const {email, password} = req.body;

        if(!email || !password) return res.status(400).json({message: " All fields are required"})

        const user = await User.findOne({ email });  
        if(!user) return res.status(404).json({message:"User does not exit"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: "Invalid Credential"});

        const token = crypto.randomBytes(32).toString("hex");

        await User.updateOne({_id: user._id}, {  token });

            const existingProfile = await Profile.findOne({ userId: user._id });
                if (!existingProfile) {
                const newProfile = new Profile({
                    userId: user._id,
                    bio: "",
                    location: "",
                    interests: [],
                });
                await newProfile.save();
            }
        return res.json({ 
              token, 
              user: { id: user._id, email: user.email, username: user.username } 
            });

      } catch(error){
        return res.status(500).json({ message: error.message });

      }
};

export const update_profile_picture = async (req,res) =>{
    const {token} = req.body;
    try{

        const user = await User.findOne({token: token});
        if(!user) return res.status(404).json({message: "User not found"})

        user.profilePicture = req.file.filename;
        await user.save();

        return res.json({message:"profile picture updated"});

    } catch(error){
        return res.status(500).json({message: error.message})
    }
};

export const updateUserProfile = async (req,res) =>{
    try{
        const {token, ...newUserData} = req.body;

        const user =await User.findOne({token: token});
        if(!user) return res.status(404).json({message: "user not found"});

        const {username, email} = newUserData;

        const findSameUser = await User.findOne({$or: [{ username }, { email }] });

            if(findSameUser && String(findSameUser._id) !== String(user._id)) { 
                return res.status(400).json({message: "user already exits"});
            } 

        Object.assign(user, newUserData);

        await user.save();

        return res.json({message: "User updated"});
        
    } catch(error){
        return res.status(500).json({message: error.message});
    }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; 



    const user = await User.findOne({ token }); 

    if (!user) return res.status(404).json({ message: "user not found" });

    const userProfile = await Profile.findOne({ userId: user._id })
      .populate("userId", "name email username profilePicture");

   
    return res.json({ user, profile: userProfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const updateProfileData = async (req,res) =>{
    try{

        const {token, ...newProfileData} = req.body;

        const userProfile = await User.findOne({token : token});
        if(!userProfile) return res.status(404).json({message: "user not found"});

        const profile_to_update = await Profile.findOne({userId: userProfile._id});

        Object.assign(profile_to_update, newProfileData);

        await profile_to_update.save();

        return res.json({message: "profile updated",  profile: profile_to_update});

    } catch(error){
        return res.status(500).json({message: error.message});
    }
}

export const getAllUserProfile = async (req,res) =>{
    try{
        const profiles = await Profile.find()
         .populate("userId", "name username email profilePicture");

        return res.json({profiles});

    } catch(error){
        return res.status(500).json({message: error.message});
    }
};

export const downloadProfile = async (req,res) =>{
    const user_id = req.query.id;

    const userProfile = await Profile.findOne({userId: user_id})
        .populate("userId", " name username email profilePicture");

    if(!userProfile) return res.status(404).json({message: "Profile is not found"});
    let outputPath = await convertUserDataToPDF(userProfile);

    return res.json({"message":outputPath})
}

export const sendConnectionRequest = async(req, res) => {
    const { token, connectionId } = req.body;

    if (!token || !connectionId) {
        return res.status(400).json({ message: "Token and connectionId are required" });
    }

    try {
        const user = await User.findOne({ token });
        if (!user) return res.status(404).json({ message: "User not found" });

        const connectionUser = await User.findById(connectionId);
        if (!connectionUser) return res.status(404).json({ message: "Connection user not found" });

        const existingRequest = await ConnectionRequest.findOne({
            userId: user._id,
            connectionId: connectionUser._id
        });

        if (existingRequest) return res.status(400).json({ message: "Request already sent" });

        const request = new ConnectionRequest({
            userId: user._id,
            connectionId: connectionUser._id
        });

        await request.save();

        return res.json({ message: "Request Sent" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getMyConnectionRequests = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "user not found" });

    
    const pending = await ConnectionRequest.find({
      status_accepted: false,
      $or: [{ userId: user._id }, { connectionId: user._id }],
    })
      .populate("userId", "name username email profilePicture")
      .populate("connectionId", "name username email profilePicture");

    
    const connections = pending.map((doc) => {
      const isSender = String(doc.userId._id) === String(user._id);
      const other = isSender ? doc.connectionId : doc.userId;

      return {
        _id: doc._id,
        otherUser: other,       
        status: "pending",      
        requestedAt: doc.createdAt,
      };
    });

    return res.json({ connections });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const whatAreMyConnection = async (req,res) =>{
    const {token} = req.query;
    try{
        const user = await User.findOne({token});
        if(!user) return res.status(404).json({message: "user not found"});
        
        const connection = await ConnectionRequest.find({ connectionId: user._id})
            .populate("userId", "name username email profilePicture");

        return res.json({connection});

    } catch(err){
        return res.status(500).json({message: err.message});
    }
}


export const acceptConnectionRequest = async (req, res) => {
  try {
    const { connectionId, action, token } = req.body;

    if (!token) return res.status(400).json({ message: "Token is required" });
    if (!connectionId) return res.status(400).json({ message: "Connection ID required" });


    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

 
    if (!mongoose.Types.ObjectId.isValid(connectionId))
      return res.status(400).json({ message: "Invalid connection request ID" });


    const connection = await ConnectionRequest.findOne({
      _id: connectionId,
      connectionId: user._id, 
    });

    if (!connection)
      return res.status(404).json({ message: "Connection not found" });

 
    connection.status_accepted = action === "accept" ? true : false;
    await connection.save();

    return res.json({ message: "Connection updated successfully" });
  } catch (error) {
    console.error("Error in acceptConnectionRequest:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



export const commentPost = async (req, res) => {
    const { token, post_id, commentBody } = req.body; 

    if (!token || !post_id || !commentBody || commentBody.trim() === "") {
        return res.status(400).json({ message: "Token, post_id and commentBody are required" });
    }

    try {
        const user = await User.findOne({ token }).select("_id");
        if (!user) return res.status(404).json({ message: "User is not found." });

        const post = await Post.findById(post_id);
        if (!post) return res.status(404).json({ message: "Post is not found." });

        const comment = new Comment({
            userId: user._id,
            postId: post_id,
            body: commentBody, 
        });

        await comment.save();
        return res.status(200).json( {comment, message: "Comment added" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const getUserProfileAndUserBasedOnUsername = async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id })
      .populate("userId", "name username email profilePicture");

    if(!userProfile){
      return res.status(404).json({message: "Profile not found"});
    }

     return res.json({
      profile: {
        _id: userProfile._id,
        userId: userProfile.userId,
        bio: userProfile.bio,
        currentPost: userProfile.currentPost,
        pastWork: userProfile.pastWork || [],
        education: userProfile.education || [], 
        createdAt: userProfile.createdAt,
      },
    });


  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getMySentConnectionRequests = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "user not found" });

    
    const sent = await ConnectionRequest.find({ userId: user._id, status_accepted: null })
      .populate("connectionId", "name username email profilePicture"); 

    return res.json({ sent });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



export const getMyReceivedConnectionRequests = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "user not found" });

    
    const received = await ConnectionRequest.find({ connectionId: user._id, status_accepted: null })
      .populate("userId", "name username email profilePicture"); 

    return res.json({ received });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getMyNetwork = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "user not found" });

    
    const accepted = await ConnectionRequest.find({
      status_accepted: true,
      $or: [{ userId: user._id }, { connectionId: user._id }],
    })
      .populate("userId", "name username email profilePicture")
      .populate("connectionId", "name username email profilePicture");

    
    const network = accepted.map((doc) => {
      const isSender = String(doc.userId._id) === String(user._id);
      const other = isSender ? doc.connectionId : doc.userId;

      return {
        _id: doc._id,
        otherUser: other,      
        status: "connected",  
        acceptedAt: doc.updatedAt,
      };
    });

    return res.json({ network });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

