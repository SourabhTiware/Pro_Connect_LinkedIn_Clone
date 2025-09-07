
import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // mongoose ch name dyache ithe ref. variable ch nav dyach nahi. 
    },
    body:{
        type:String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt:{
        type: Date,
        default: Date.now,
    },
    media:{
        type: String,
        default: "",
    },
    // this use for check if any media is irrpective or nudity.. if it is wrong then set to false. means it's not show on webpage. It is use for webSite safty.. to use "CrownJob" (tool) run on backend server and check one by one post. 
    active:{                
        
        type: Boolean,
        default: true,
    },
    fileType:{
        type: String,
        default: "",
    },

});


// const Post = mongoose.model("Post", postSchema);
const Post = mongoose.model("Post", postSchema);


// export default Post;
export default Post;
