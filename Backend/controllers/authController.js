const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

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

// ✅ Librarian Login with Validation
exports.librarianLogin = [
    // Validate email and password
    body("email").isEmail().withMessage("Please provide a valid email address."),
    body("password").notEmpty().withMessage("Password is required."),

    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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
    }
];

// ✅ Student Login with Validation
exports.studentLogin = [
    // Validate email and password
    body("email").isEmail().withMessage("Please provide a valid email address."),
    body("password").notEmpty().withMessage("Password is required."),

    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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
    }
];

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