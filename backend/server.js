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

// app.use(cors({
//   origin: [
//     "http://localhost:3000",  // for local dev
//     "https://pro-connect-linked-in-clone-six.vercel.app" // for Vercel
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));


const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://pro-connect-linked-in-clone-six.vercel.app", // previous Vercel deployment
  "https://pro-connect-linked-in-clone-9f46p3951-sourabh-tiwares-projects.vercel.app" // new Vercel deployment
];


app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow Postman or curl
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `CORS policy: origin ${origin} not allowed`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// This handles preflight requests for all routes
app.options("*", cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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