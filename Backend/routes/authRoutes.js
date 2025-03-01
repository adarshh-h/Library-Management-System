const express = require("express");
const { registerLibrarian, login } = require("../controllers/authController");

const router = express.Router();

// ✅ Correct Route for Librarian Registration
router.post("/register-librarian", registerLibrarian);
router.post("/login", login);

module.exports = router;
