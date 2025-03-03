const User = require("../models/User");

// ✅ Create Student Account (Only for Librarians)
// exports.createStudent = async (req, res) => {
    // try {
    //     const { name, email, phone, department, batch, rollNumber } = req.body;

    //     // Check if the student already exists
    //     const studentExists = await User.findOne({ email });
    //     if (studentExists) {
    //         return res.status(400).json({ message: "A student with this email already exists!" });
    //     }

    //     // Generate password based on the student's name
    //     const firstName = name.split(" ")[0]; // Extract the first name
    //     const password = `${firstName.substring(0, 2)}@123`; // First two letters + "@123"

    //     // Create the student account
    //     const student = new User({
    //         name,
    //         email,
    //         phone,
    //         password, // Password will be hashed by the pre-save hook in the User model
    //         department,
    //         batch,
    //         rollNumber, // Add rollNumber for students
    //         role: "student", // Set role to "student"
    //         createdBy: req.user._id, // Track which librarian created this student
    //     });

    //     await student.save();

    //     // Return the auto-generated password (for one-time use)
    //     res.status(201).json({
    //         message: "Student account created successfully!",
    //         student: { name, email, department, batch, rollNumber },
    //         password, // Send the auto-generated password to the librarian
    //     });
    // } catch (error) {
    //     console.error("Error creating student account:", error);
    //     res.status(500).json({ message: "Server Error" });
    // }

// };


exports.createStudent = async (req, res) => {
    try {
        const { name, email, phone, department, batch, rollNumber } = req.body;

        // Validate name (alphabets, spaces, hyphens, and apostrophes)
        const nameRegex = /^[A-Za-z\s'-]+$/;
        if (!nameRegex.test(name)) {
            return res.status(400).json({ message: "Name can only contain alphabets, spaces, hyphens, and apostrophes!" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address!" });
        }

        // Validate phone number (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Please enter a valid 10-digit phone number!" });
        }

        // Validate department (alphabets, spaces, and & symbol)
        const departmentRegex = /^[A-Za-z\s&]+$/;
        if (!departmentRegex.test(department)) {
            return res.status(400).json({ message: "Department can only contain alphabets, spaces, and the & symbol!" });
        }

        // Validate batch (format: YYYY-YYYY)
        const batchRegex = /^\d{4}-\d{4}$/;
        if (!batchRegex.test(batch)) {
            return res.status(400).json({ message: "Batch must be in the format YYYY-YYYY (e.g., 2021-2025)!" });
        }

        // Validate roll number (only numbers)
        const rollNumberRegex = /^\d+$/;
        if (!rollNumberRegex.test(rollNumber)) {
            return res.status(400).json({ message: "Roll number can only contain numbers!" });
        }

        // Check if the student already exists
        const studentExists = await User.findOne({ email });
        if (studentExists) {
            return res.status(400).json({ message: "A student with this email already exists!" });
        }

        // Generate password based on the student's name
        const firstName = name.split(" ")[0]; // Extract the first name
        const password = `${firstName.substring(0, 2)}@123`; // First two letters + "@123"

        // Create the student account
        const student = new User({
            name,
            email,
            phone,
            password, // Password will be hashed by the pre-save hook in the User model
            department,
            batch,
            rollNumber,
            role: "student", // Set role to "student"
            createdBy: req.user._id, // Track which librarian created this student
        });

        await student.save();

        // Return the auto-generated password (for one-time use)
        res.status(201).json({
            message: "Student account created successfully!",
            student: { name, email, department, batch, rollNumber },
            password, // Send the auto-generated password to the librarian
        });
    } catch (error) {
        console.error("Error creating student account:", error);
        res.status(500).json({ message: "Server Error" });
    }
};