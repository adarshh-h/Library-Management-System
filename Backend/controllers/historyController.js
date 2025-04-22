// const Issue = require("../models/Issue");
// const User = require("../models/User");

// const getIssueReturnHistory = async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     if (!studentId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Student ID is required" 
//       });
//     }

//     // Get student details
//     const student = await User.findById(studentId)
//       .select("name rollNumber department batch");
    
//     if (!student) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Student not found" 
//       });
//     }

//     // Get all issue records for the student
//     const issues = await Issue.find({ student: studentId })
//       .populate("books.book", "bookName accessionNumber authorName")
//       .populate("returnedBooks.book", "bookName accessionNumber authorName")
//       .sort({ createdAt: -1 });

//     if (!issues.length) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "No transactions found for this student" 
//       });
//     }

//     // Process all transactions
//     const transactions = [];
    
//     issues.forEach(issue => {
//       // Create a map of returned books for this issue
//       const returnedMap = new Map();
//       issue.returnedBooks.forEach(returnEntry => {
//         returnedMap.set(returnEntry.book._id.toString(), returnEntry.returnedAt);
//       });

//       // Process each book in the issue
//       issue.books.forEach(bookEntry => {
//         const bookId = bookEntry.book._id.toString();
//         const isReturned = returnedMap.has(bookId);
        
//         transactions.push({
//           book: {
//             _id: bookEntry.book._id,
//             bookName: bookEntry.book.bookName,
//             accessionNumber: bookEntry.book.accessionNumber,
//             authorName: bookEntry.book.authorName
//           },
//           issueId: issue._id,
//           issueDate: bookEntry.issueDate,
//           dueDate: bookEntry.dueDate,
//           returned: isReturned,
//           returnedAt: isReturned ? returnedMap.get(bookId) : null
//         });
//       });
//     });

//     res.status(200).json({
//       success: true,
//       student: {
//         name: student.name,
//         rollNumber: student.rollNumber,
//         department: student.department,
//         batch: student.batch
//       },
//       transactions
//     });

//   } catch (error) {
//     console.error("Error in getIssueReturnHistory:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Server error",
//       error: error.message 
//     });
//   }
// };

// module.exports = { getIssueReturnHistory };

const Issue = require("../models/Issue");
const User = require("../models/User");

const getIssueReturnHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Validate studentId exists
    if (!studentId) {
      return res.status(400).json({ 
        success: false,
        message: "Student ID is required"
      });
    }

    // Get student details
    const student = await User.findById(studentId)
      .select("name rollNumber department batch email");
    
    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: "Student not found",
        code: "STUDENT_NOT_FOUND"
      });
    }

    // Get all issue records for the student
    const issues = await Issue.find({ student: studentId })
      .populate({
        path: "books.book",
        select: "bookName accessionNumber authorName"
      })
      .populate({
        path: "returnedBooks.book",
        select: "_id"
      })
      .sort({ createdAt: -1 });

    // Prepare empty response with student info
    const response = {
      success: true,
      student: {
        name: student.name,
        rollNumber: student.rollNumber,
        department: student.department,
        batch: student.batch,
        email: student.email
      },
      transactions: [],
      message: "No transactions found for this student"
    };

    // If no issues found, return with student info
    if (!issues.length) {
      return res.status(200).json(response);
    }

    // Process transactions
    const transactions = [];

    issues.forEach(issue => {
      const returnedMap = new Map();
      issue.returnedBooks.forEach(returnEntry => {
        returnedMap.set(returnEntry.book._id.toString(), returnEntry.returnedAt);
      });

      issue.books.forEach(bookEntry => {
        const bookId = bookEntry.book._id.toString();
        const isOverdue = new Date() > new Date(bookEntry.dueDate);
        const fine = returnedMap.has(bookId) ? 
          (bookEntry.fine || 0) : 
          isOverdue ? calculateFine(new Date(bookEntry.dueDate)) : 0;

        transactions.push({
          book: {
            _id: bookEntry.book._id,
            bookName: bookEntry.book.bookName,
            accessionNumber: bookEntry.book.accessionNumber,
            authorName: bookEntry.book.authorName
          },
          issueId: issue._id,
          issueDate: bookEntry.issueDate,
          dueDate: bookEntry.dueDate,
          returned: returnedMap.has(bookId),
          returnedAt: returnedMap.get(bookId) || null,
          fine: fine,
          isOverdue: isOverdue
        });
      });
    });

    // Update response with transactions
    response.transactions = transactions;
    response.message = `Found ${transactions.length} transactions`;
    
    if (transactions.length === 0) {
      response.message = "No transactions found for this student";
    }

    res.status(200).json(response);

  } catch (error) {
    console.error("Error in getIssueReturnHistory:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error while fetching history",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      code: "SERVER_ERROR"
    });
  }
};

module.exports = { getIssueReturnHistory };