dotenv.config();

import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import postRoutes from "./routes/posts.routes.js"
import userRoutes from "./routes/users.routes.js"

const app = express();

// app.use(cors({
//   origin: "http://localhost:3000", 
//   credentials: true               
// }));

app.use(cors({
  origin: [
    "https://pro-connect-linked-in-clone-six.vercel.app" // for Vercel
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);

app.use(express.static("uploads"));

app.get("/", (req, res) => {
    res.send("Backend server is running!");
});

const start = async () =>{
    const connectDB = await mongoose.connect(process.env.dbURL);

    app.listen(9090,() =>{
        console.log("server is running on port 9090");
    })

}

start();