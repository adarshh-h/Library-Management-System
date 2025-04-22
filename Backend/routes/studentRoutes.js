const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Issue = require("../models/Issue");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Dashboard route
router.get("/dashboard", protect("student"), (req, res) => {
    res.json({ 
        message: "Welcome to Student Dashboard!", 
        user: req.user 
    });
});

// Get currently issued books
router.get("/issued-books", protect("student"), async (req, res) => {
    try {
        const issues = await Issue.find({ 
            student: req.user._id 
        })
        .populate({
            path: "books.book",
            select: "bookName accessionNumber authorName"
        })
        .populate({
            path: "returnedBooks.book",
            select: "_id"
        });

        const unreturnedBooks = [];
        
        issues.forEach(issue => {
            const returnedSet = new Set(
                issue.returnedBooks.map(r => r.book._id.toString())
            );

            issue.books.forEach(bookObj => {
                const bookId = bookObj.book._id.toString();
                if (!returnedSet.has(bookId)) {
                    unreturnedBooks.push({
                        _id: bookObj.book._id,
                        bookName: bookObj.book.bookName,
                        accessionNumber: bookObj.book.accessionNumber,
                        authorName: bookObj.book.authorName,
                        issueDate: bookObj.issueDate,
                        dueDate: bookObj.dueDate
                    });
                }
            });
        });

        res.json({ books: unreturnedBooks });
    } catch (error) {
        console.error("Error fetching issued books:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get transaction history
router.get("/history", protect("student"), async (req, res) => {
    try {
        const issues = await Issue.find({ 
            student: req.user._id 
        })
        .populate({
            path: "books.book",
            select: "bookName accessionNumber authorName"
        })
        .populate({
            path: "returnedBooks.book",
            select: "bookName accessionNumber"
        })
        .sort({ createdAt: -1 });

        const transactions = [];
        
        issues.forEach(issue => {
            const returnedMap = new Map();
            issue.returnedBooks.forEach(returnEntry => {
                returnedMap.set(returnEntry.book._id.toString(), returnEntry.returnedAt);
            });

            issue.books.forEach(bookEntry => {
                transactions.push({
                    book: bookEntry.book,
                    issueDate: bookEntry.issueDate,
                    dueDate: bookEntry.dueDate,
                    returned: returnedMap.has(bookEntry.book._id.toString()),
                    returnedAt: returnedMap.get(bookEntry.book._id.toString())
                });
            });
        });

        res.json({ transactions });
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.post("/change-password", protect("student"), async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
  
      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: "Both current and new password are required.",
        });
      }
  
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: "New password must be at least 6 characters long.",
        });
      }
  
      // Fetch user
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found.",
        });
      }
  
      // Match current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          error: "Current password is incorrect.",
        });
      }
  
      // Check if new password is same as current
      const isSame = await bcrypt.compare(newPassword, user.password);
      if (isSame) {
        return res.status(400).json({
          success: false,
          error: "New password must be different from current password.",
        });
      }
  
      // Set new password (will hash automatically via pre-save middleware)
      user.password = newPassword;
      user.passwordChangedAt = Date.now();
      await user.save();
  
      res.json({
        success: true,
        message: "Password changed successfully. Please login again.",
      });
    } catch (error) {
      console.error("Error changing password:", error.message);
      res.status(500).json({
        success: false,
        error: "Server error while changing password.",
      });
    }
  });
  
module.exports = router;