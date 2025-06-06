require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

connectDB(); 
const app = express();

app.use(express.json());
app.use(cookieParser()); 

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
