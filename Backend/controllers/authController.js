// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // ✅ Librarian Registration (Fix: Don't hash password in controller)
// exports.registerLibrarian = async (req, res) => {
//     try {
//         const { name, email, phone, password, department } = req.body;

//         const userExists = await User.findOne({ email });
//         if (userExists) return res.status(400).json({ message: "Librarian already exists" });

//         // ❌ Don't hash password here (Schema handles hashing)
//         const librarian = new User({ 
//             name, 
//             email, 
//             phone, 
//             password, // Will be hashed in schema
//             department, 
//             role: "librarian" 
//         });

//         await librarian.save();
//         res.status(201).json({ message: "Librarian registered successfully" });
//     } catch (error) {
//         console.error("Error registering librarian:", error);
//         res.status(500).json({ message: "Server Error" });
//     }
// };

// // ✅ Fix Login Function (Ensure bcrypt.compare works correctly)
// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // ✅ Find user by email
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ message: "Invalid Credentials" });

//         // ✅ Compare entered password with stored hash
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

//         // ✅ Generate JWT Token
//         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

//         res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
//     } catch (error) {
//         console.error("Login Error:", error);
//         res.status(500).json({ message: "Server Error" });
//     }
// };

// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // ✅ Librarian Login Route
// exports.librarianLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // ✅ Find librarian by email
//         const user = await User.findOne({ email, role: "librarian" });
//         if (!user) return res.status(400).json({ message: "Librarian not found!" });

//         // ✅ Compare entered password with stored hash
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

//         // ✅ Generate JWT Token
//         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

//         // ✅ Store token in HttpOnly cookie (more secure than localStorage)
//         res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict", maxAge: 3600000 });

//         res.json({ message: "Librarian logged in successfully!", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
//     } catch (error) {
//         res.status(500).json({ message: "Server Error" });
//     }
// };

// // ✅ Student Login Route
// exports.studentLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // ✅ Find student by email
//         const user = await User.findOne({ email, role: "student" });
//         if (!user) return res.status(400).json({ message: "Student not found!" });

//         // ✅ Compare entered password with stored hash
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

//         // ✅ Generate JWT Token
//         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

//         // ✅ Store token in HttpOnly cookie
//         res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict", maxAge: 3600000 });

//         res.json({ message: "Student logged in successfully!", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
//     } catch (error) {
//         res.status(500).json({ message: "Server Error" });
//     }
// };

// // ✅ Logout Route (Clears Token)
// exports.logout = (req, res) => {
//     res.clearCookie("token");
//     res.json({ message: "Logged out successfully!" });
// };





const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Generate JWT & Set Cookie (Secure & Flexible)
const generateToken = (res, user) => {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // ✅ Only secure in production
        sameSite: "Strict",
        maxAge: 3600000 // ✅ 1 Hour Expiry
    });
};

// ✅ Librarian Login
exports.librarianLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!process.env.JWT_SECRET) return res.status(500).json({ message: "Server configuration error!" });

        const user = await User.findOne({ email, role: "librarian" });
        if (!user) return res.status(400).json({ message: "Librarian not found!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

        generateToken(res, user);

        res.json({ message: "Librarian logged in successfully!", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// ✅ Student Login
exports.studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!process.env.JWT_SECRET) return res.status(500).json({ message: "Server configuration error!" });

        const user = await User.findOne({ email, role: "student" });
        if (!user) return res.status(400).json({ message: "Student not found!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

        generateToken(res, user);

        res.json({ message: "Student logged in successfully!", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// ✅ Logout Route (Clears Token & Expiry)
exports.logout = (req, res) => {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) }); // ✅ Explicit Expiry
    res.json({ message: "Logged out successfully!" });
};

// ✅ Check Session Validity
exports.checkSession = (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Session expired. Please log in again." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ user: decoded });
    } catch (error) {
        res.status(401).json({ message: "Invalid session." });
    }
};
