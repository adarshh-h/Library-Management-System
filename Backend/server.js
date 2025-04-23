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
app.use(cors({
    origin: [
        "http://localhost:5173", 
        "https://library-management-system-liart-six.vercel.app"
    ],
    credentials: true
}));



app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/books", require("./routes/bookRoutes")); 


app.use("/api/issues", require("./routes/issueRoutes.js"));
app.use("/api/returns", require("./routes/returnRoutes.js"));

app.use("/api/history", require("./routes/historyRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
