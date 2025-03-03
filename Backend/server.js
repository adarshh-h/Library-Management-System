// require("dotenv").config();
// const express = require("express");
// const connectDB = require("./config/db");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");

// connectDB(); // Connect to MongoDB

// const app = express();
// app.use(express.json());
// app.use(cookieParser()); // ✅ Enable Cookie Parsing

// // ✅ Secure CORS Configuration
// app.use(cors({
//     origin: "http://localhost:5173", // Change this to your frontend URL in production
//     credentials: true // ✅ Allows sending cookies from frontend
// }));

// // ✅ Authentication Routes
// app.use("/api/auth", require("./routes/authRoutes"));
// // ✅ Protected Routes for Dashboard
// app.use("/api/admin", require("./routes/adminRoutes"));  // ✅ Librarian Dashboard
// app.use("/api/student", require("./routes/studentRoutes"));  // ✅ Student Dashboard
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json());
app.use(cookieParser()); // ✅ Enable Cookie Parsing

// ✅ Secure CORS Configuration
app.use(cors({
    origin: "http://localhost:5173", // Change this to your frontend URL in production
    credentials: true // ✅ Allows sending cookies from frontend
}));

// ✅ Authentication Routes
app.use("/api/auth", require("./routes/authRoutes"));
// ✅ Admin Routes (Librarian Dashboard and Create Student)
app.use("/api/admin", require("./routes/adminRoutes"));
// ✅ Student Routes
app.use("/api/student", require("./routes/studentRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));