const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createStudent } = require("../controllers/studentController");

const router = express.Router();

// ✅ Librarian Dashboard Route
router.get("/dashboard", protect("librarian"), (req, res) => {
    res.json({ message: "Welcome to Admin Dashboard!", user: req.user });
});

// ✅ Create Student Account Route (Only for Librarians)
router.post("/create-student", protect("librarian"), createStudent);

module.exports = router;