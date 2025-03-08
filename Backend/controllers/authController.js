const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const otpStorage = {}; 

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // ✅ Generate a 6-digit OTP (Numbers only)
        // const otp = otpGenerator.generate(6, { 
        //     digits: true, 
        //     alphabets: false, 
        //     specialChars: false 
        // });
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        console.log("Generated OTP:", otp); // Debugging to verify numeric OTP

        // ✅ Store OTP (Modify storage as per your choice: In-Memory, Redis, or MongoDB)
        otpStorage[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

        // ✅ Send OTP via email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "OTP sent to your email." });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // ✅ Check OTP in memory
        if (!otpStorage[email] || otpStorage[email].otp !== otp || Date.now() > otpStorage[email].expiresAt) {
            return res.status(400).json({ message: "Invalid or expired OTP!" });
        }

        // ✅ Remove OTP from memory after verification
        delete otpStorage[email];

        // ✅ Update only the password (role remains unchanged)
        user.password = newPassword;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({ message: "Password reset successful!" });
    } catch (error) {
        console.error("Error in verifyOtp:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

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