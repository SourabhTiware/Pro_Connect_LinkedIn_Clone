// dotenv.config();

// import express from 'express';
// import cors from 'cors';
// import dotenv from "dotenv";
// import mongoose from 'mongoose';
// import postRoutes from "./routes/posts.routes.js"
// import userRoutes from "./routes/users.routes.js"

// const app = express();

// // app.use(cors({
// //   origin: "http://localhost:3000", 
// //   credentials: true               
// // }));

// // app.use(cors({
// //   origin: [
// //     "http://localhost:3000",  // for local dev
// //     "https://pro-connect-linked-in-clone-six.vercel.app" // for Vercel
// //   ],
// //   methods: ["GET", "POST", "PUT", "DELETE"],
// //   allowedHeaders: ["Content-Type", "Authorization"],
// //   credentials: true
// // }));


// const allowedOrigins = [
//   "http://localhost:3000",
// ];

// app.use(cors({
//   origin: function(origin, callback){
//     if(!origin) return callback(null, true); // allow Postman, curl
//     if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
//     if (/https:\/\/pro-connect-linked-in-clone-.*\.vercel\.app/.test(origin)) {
//       return callback(null, true); // allow all Vercel subdomains
//     }
//     return callback(new Error(`CORS policy: origin ${origin} not allowed`), false);
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));


// app.use(express.json());

// app.use(postRoutes);
// app.use(userRoutes);

// app.use(express.static("uploads"));

// app.get("/", (req, res) => {
//     res.send("Backend server is running!");
// });

// const start = async () =>{
//     const connectDB = await mongoose.connect(process.env.dbURL);

//     app.listen(9090,() =>{
//         console.log("server is running on port 9090");
//     })

// }

// start();



import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/users.routes.js";

dotenv.config();
const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    console.log("🌐 Incoming request from origin:", origin);

    const allowedOrigins = [
      "http://localhost:3000",
      "https://pro-connect-linked-in-clone-murex.vercel.app" // production
    ];

    // Allow requests with no origin (like Postman, curl)
    if (!origin) return callback(null, true);

    // Allow specific origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow all Vercel preview deployments (*.vercel.app)
    if (/https:\/\/pro-connect-linked-in-clone-.*\.vercel\.app/.test(origin)) {
      return callback(null, true);
    }

    console.warn(`❌ CORS blocked request from: ${origin}`);
    return callback(new Error(`CORS policy: origin ${origin} not allowed`), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));


// Parse JSON bodies
app.use(express.json());

// Routes
app.use(postRoutes);
app.use(userRoutes);

// Serve uploads
app.use(express.static("uploads"));

// Health check
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Start server and connect to DB
const start = async () => {
  try {
    await mongoose.connect(process.env.dbURL);
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 9090;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

start();
