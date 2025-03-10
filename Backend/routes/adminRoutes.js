const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const csv = require("csv-parser");
const fs = require("fs");
const multer = require("multer");
const { createStudent, getStudents, getStudentById, updateStudent, deleteStudent, bulkImportStudents } = require("../controllers/studentController");
const { createLibrarian } = require("../controllers/librarianController");


const router = express.Router();
const upload = multer({ dest: "uploads/" }); 

router.get("/dashboard", protect("librarian"), (req, res) => {
    res.json({ message: "Welcome to Admin Dashboard!", user: req.user });
});

router.post("/create-student", protect("librarian"), createStudent);

router.get("/students", protect("librarian"), getStudents);

router.get("/students/:id", protect("librarian"), getStudentById);

router.put("/students/:id", protect("librarian"), updateStudent);

router.delete("/students/:id", protect("librarian"), deleteStudent);

router.post("/bulk-import-students", protect("librarian"), upload.single("file"), bulkImportStudents);

router.post("/create-librarian", protect("librarian"), createLibrarian);


module.exports = router;

// const { protect } = require("../middleware/authMiddleware");
// const { createStudent, getStudents, getStudentById, updateStudent, deleteStudent, bulkImportStudents } = require("../controllers/studentController");
// const upload = require("../config/multer");

// const router = express.Router();

// // ✅ Librarian Dashboard Route
// router.get("/dashboard", protect("librarian"), (req, res) => {
//     res.json({ message: "Welcome to Admin Dashboard!", user: req.user });
// });

// // ✅ Create Student Account Route
// router.post("/create-student", protect("librarian"), createStudent);

// // ✅ View All Students Route
// router.get("/students", protect("librarian"), getStudents);

// // ✅ View Single Student Route
// router.get("/students/:id", protect("librarian"), getStudentById);

// // ✅ Update Student Route
// router.put("/students/:id", protect("librarian"), updateStudent);

// // ✅ Delete Student Route
// router.delete("/students/:id", protect("librarian"), deleteStudent);

// // ✅ Bulk Import Students Route
// router.post("/bulk-import-students", protect("librarian"), upload.single("file"), bulkImportStudents);

// module.exports = router;