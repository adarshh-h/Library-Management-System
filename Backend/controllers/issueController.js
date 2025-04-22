const Issue = require("../models/Issue");
const Book = require("../models/Book");
const User = require("../models/User");

const getBookDetails = async (req, res) => {
  try {
    const { accessionNumber } = req.params;
    
    console.log("Fetching book with accession:", accessionNumber); // Debug log
    
    if (!accessionNumber) {
      return res.status(400).json({ 
        success: false, 
        message: "Accession number is required" 
      });
    }

    const book = await Book.findOne({ accessionNumber });
    
    if (!book) {
      console.log("No book found with accession:", accessionNumber); // Debug log
      return res.status(404).json({ 
        success: false, 
        message: "Book not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      book: {
        _id: book._id,
        bookName: book.bookName,
        authorName: book.authorName,
        accessionNumber: book.accessionNumber
      }
    });
  } catch (error) {
    console.error("Error in getBookDetails:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

const getStudentDetails = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    
    console.log("Fetching student with roll number:", rollNumber); // Debug log
    
    if (!rollNumber) {
      return res.status(400).json({ 
        success: false, 
        message: "Roll number is required" 
      });
    }

    const student = await User.findOne({ 
      rollNumber, 
      role: "student" 
    });
    
    if (!student) {
      console.log("No student found with roll number:", rollNumber); // Debug log
      return res.status(404).json({ 
        success: false, 
        message: "Student not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      student: {
        _id: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        department: student.department,
        batch: student.batch
      }
    });
  } catch (error) {
    console.error("Error in getStudentDetails:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

const issueBooksToStudent = async (req, res) => {
  try {
    const { studentId, bookIds, issueDate, dueDate } = req.body;

    if (!studentId || !bookIds?.length || !issueDate || !dueDate) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Validate student
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Validate books
    const books = await Book.find({ _id: { $in: bookIds } });
    if (books.length !== bookIds.length) {
      return res.status(404).json({ success: false, message: "One or more books not found" });
    }

    // ✅ Get or create the student's issue record
    let issueRecord = await Issue.findOne({ student: studentId });

    // ✅ Create returned book set
    const returnedSet = new Set(
      issueRecord?.returnedBooks.map(rb => rb.book.toString()) || []
    );

    // ✅ Collect globally issued books (not returned)
    const globalIssues = await Issue.find({
      "books.book": { $in: bookIds },
    });

    const globallyUnavailable = new Set();

    for (const issue of globalIssues) {
      for (const b of issue.books) {
        const bookIdStr = b.book.toString();
        const returned = issue.returnedBooks?.some(
          (r) => r.book.toString() === bookIdStr
        );
        if (!returned && bookIds.includes(bookIdStr)) {
          globallyUnavailable.add(bookIdStr);
        }
      }
    }

    // ✅ Filter only books that can be issued
    const newBooks = books
      .filter(book => {
        const id = book._id.toString();
        const alreadyIssuedInThisRecord = issueRecord?.books?.some(
          b => b.book.toString() === id && !returnedSet.has(id)
        );
        return !globallyUnavailable.has(id) && !alreadyIssuedInThisRecord;
      })
      .map(book => ({
        book: book._id,
        issueDate,
        dueDate
      }));

    if (!newBooks.length) {
      return res.status(400).json({
        success: false,
        message: "Books are already issued or not eligible for this student."
      });
    }

    // ✅ Update or create issue record
    if (issueRecord) {
      issueRecord.books.push(...newBooks);
      await issueRecord.save();
    } else {
      issueRecord = new Issue({
        student: studentId,
        books: newBooks
      });
      await issueRecord.save();
    }

    res.status(201).json({
      success: true,
      message: "Books issued successfully",
      issue: issueRecord
    });

  } catch (error) {
    console.error("❌ Error issuing books:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = {
  getBookDetails,
  getStudentDetails,
  issueBooksToStudent
};
