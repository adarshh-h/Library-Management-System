import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReturnBooks = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "https://library-management-system-ae84.onrender.com";

  const handleSearch = async () => {
    if (!rollNumber.trim()) {
      toast.warning("Please enter a roll number");
      return;
    }

    setStudent(null);
    setBooks([]);
    setLoading(true);
    setHasSearched(true);
    
    try {
      const res = await axios.get(`/api/issues/student-by-roll/${rollNumber}`);
      if (res.data.success) {
        setStudent(res.data.student);
        fetchUnreturnedBooks(res.data.student._id);
      } else {
        toast.error("Student not found.");
      }
    } catch (err) {
      toast.error("Server error while searching student.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreturnedBooks = async (studentId) => {
    try {
      const res = await axios.get(`/api/returns/student/${studentId}`);
      if (res.data.success) {
        setBooks(res.data.books);
        if (res.data.books.length === 0) {
          toast.info("This student has no books to return.");
        }
      } else {
        toast.info(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to load unreturned books.");
    }
  };

  const handleReturn = async (book) => {
    try {
      const res = await axios.post("/api/returns", {
        studentId: student._id,
        bookId: book._id,
        issueId: book.issueId
      });

      if (res.data.success) {
        setBooks((prev) => prev.filter((b) => b._id !== book._id));
        toast.success(`Successfully returned: ${book.bookName}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error returning book");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📘 Return Books</h2>

      {/* Search Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="border px-4 py-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !rollNumber.trim()}
          className={`px-4 py-2 rounded text-white ${
            loading || !rollNumber.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </span>
          ) : (
            "Search"
          )}
        </button>
      </div>

      {/* Student Info */}
      {student && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6 shadow-sm">
          <h3 className="font-bold text-lg text-blue-800 mb-2">Student Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><span className="font-medium">Name:</span> {student.name}</p>
            <p><span className="font-medium">Roll No:</span> {student.rollNumber}</p>
            <p><span className="font-medium">Department:</span> {student.department}</p>
            {student.batch && <p><span className="font-medium">Batch:</span> {student.batch}</p>}
          </div>
        </div>
      )}

      {/* Results Section */}
      {hasSearched && (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          {/* Book List */}
          {books.length > 0 ? (
            <div className="divide-y divide-gray-200">
              <div className="bg-gray-50 px-4 py-3">
                <h3 className="font-semibold text-gray-800">Books to Return ({books.length})</h3>
              </div>
              {books.map((book) => (
                <div key={book._id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{book.bookName} <span className="text-sm text-gray-500">({book.accessionNumber})</span></p>
                    <p className="text-sm text-gray-600">Author: {book.authorName}</p>
                    <div className="flex gap-4 mt-1 text-sm">
                      <p className="text-gray-500">Issued: {new Date(book.issueDate).toLocaleDateString()}</p>
                      <p className={`${new Date(book.dueDate) < new Date() ? 'text-red-500' : 'text-gray-500'}`}>
                        Due: {new Date(book.dueDate).toLocaleDateString()}
                        {new Date(book.dueDate) < new Date() && " (Overdue)"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleReturn(book)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                  >
                    Return
                  </button>
                </div>
              ))}
            </div>
          ) : student ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Books to Return</h3>
              <p className="text-gray-500">This student has no outstanding books to return.</p>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Student Not Found</h3>
              <p className="text-gray-500">No student found with this roll number. Please check and try again.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReturnBooks;
