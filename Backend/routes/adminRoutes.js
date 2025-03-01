const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Librarian Dashboard Route - Send Full User Data
router.get("/dashboard", protect("librarian"), (req, res) => {
    res.json({ message: "Welcome to Admin Dashboard!", user: req.user });
});

module.exports = router;
