require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");


connectDB(); 

const app = express();
app.use(express.json());
app.use(cookieParser()); 

// app.use(cors({
//     origin: "http://localhost:5173", 
//     credentials: true 
// }));

// const allowedOrigins = [
//   'http://localhost:5173',
//    'https://library-management-system-liart-six.vercel.app',
//   'library-management-system-git-main-adarshs-projects-3c69f35f.vercel.app',
//   'library-management-system-66s345vc5-adarshs-projects-3c69f35f.vercel.app'
// ];

// const allowedOrigins = [
//   'http://localhost:5173', // For local dev
//   'https://library-management-system-liart-six.vercel.app', // Your Vercel frontend
// ];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true, // Allow cookies in cross-origin requests
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
const allowedOrigins = [
  'http://localhost:5173',
  'https://library-management-system-liart-six.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/books", require("./routes/bookRoutes")); 


app.use("/api/issues", require("./routes/issueRoutes.js"));
app.use("/api/returns", require("./routes/returnRoutes.js"));

app.use("/api/history", require("./routes/historyRoutes"));


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
