const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Student Dashboard Route - Send Full User Data
router.get("/dashboard", protect("student"), (req, res) => {
    res.json({ message: "Welcome to Student Dashboard!", user: req.user });
});

module.exports = router;

