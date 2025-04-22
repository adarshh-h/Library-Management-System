const Issue = require("../models/Issue");

const getUnreturnedBooks = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Get ALL issues for the student
    const issues = await Issue.find({ student: studentId })
      .populate("books.book", "bookName accessionNumber authorName")
      .populate("returnedBooks.book", "_id");

    if (!issues.length) {
      return res.status(404).json({ success: false, message: "No issue records found" });
    }

    const unreturnedBooks = [];

    for (const issue of issues) {
      const returnedSet = new Set(issue.returnedBooks.map(r => r.book._id.toString()));

      for (const bookObj of issue.books) {
        const bookId = bookObj.book._id.toString();
        if (!returnedSet.has(bookId)) {
          unreturnedBooks.push({
            _id: bookObj.book._id,
            bookName: bookObj.book.bookName,
            accessionNumber: bookObj.book.accessionNumber,
            authorName: bookObj.book.authorName,
            issueId: issue._id,
            issueDate: bookObj.issueDate,
            dueDate: bookObj.dueDate
          });
        }
      }
    }

    return res.status(200).json({ success: true, books: unreturnedBooks });
  } catch (error) {
    console.error("❌ Error fetching unreturned books:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const returnBook = async (req, res) => {
  try {
    const { studentId, bookId, issueId } = req.body;

    if (!studentId || !bookId || !issueId) {
      return res.status(400).json({ message: "Missing studentId, bookId, or issueId" });
    }

    const issue = await Issue.findOne({
      _id: issueId,
      student: studentId
    });

    if (!issue) {
      return res.status(404).json({ message: "Issue record not found." });
    }

    const alreadyReturned = issue.returnedBooks.some(
      (r) => r.book.toString() === bookId
    );
    if (alreadyReturned) {
      return res.status(400).json({ message: "Book already returned." });
    }

    issue.returnedBooks.push({
      book: bookId,
      returnedAt: new Date(),
    });

    await issue.save();

    res.status(200).json({ success: true, message: "Book returned successfully" });
  } catch (error) {
    console.error("❌ Return error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUnreturnedBooks, returnBook };
