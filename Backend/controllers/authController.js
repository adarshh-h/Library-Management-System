const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Librarian Registration (Fix: Don't hash password in controller)
exports.registerLibrarian = async (req, res) => {
    try {
        const { name, email, phone, password, department } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Librarian already exists" });

        // ❌ Don't hash password here (Schema handles hashing)
        const librarian = new User({ 
            name, 
            email, 
            phone, 
            password, // Will be hashed in schema
            department, 
            role: "librarian" 
        });

        await librarian.save();
        res.status(201).json({ message: "Librarian registered successfully" });
    } catch (error) {
        console.error("Error registering librarian:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// ✅ Fix Login Function (Ensure bcrypt.compare works correctly)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        // ✅ Compare entered password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        // ✅ Generate JWT Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// ✅ Librarian Adds Student
exports.addStudent = async (req, res) => {
    try {
        const { name, email, phone, password, department, batch } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Student already exists" });

        const student = new User({ 
            name, 
            email, 
            phone, 
            password, // Schema will hash it automatically
            department, 
            batch, 
            role: "student", 
            createdBy: req.user.id 
        });

        await student.save();
        res.status(201).json({ message: "Student added successfully" });
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ message: "Server error" });
    }
};