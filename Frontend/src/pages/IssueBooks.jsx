import { useState, useEffect } from "react";
import axios from "axios";

const IssueBooks = () => {
  const [accessionNumber, setAccessionNumber] = useState("");
  const [bookDetails, setBookDetails] = useState(null);
  const [rollNumber, setRollNumber] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Axios config
  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = "https://library-management-system-ae84.onrender.com";
  }, []);

  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const addDaysToDate = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split("T")[0];
  };

  useEffect(() => {
    setDueDate(addDaysToDate(getTodayDate(), 14));
  }, []);

  const fetchStudentDetails = async () => {
    setError("");
    setStudentDetails(null);
    if (!rollNumber.trim()) return;

    try {
      setLoading(true);
      const res = await axios.get(`/api/issues/student-by-roll/${rollNumber}`);
      if (res.data.success) {
        setStudentDetails(res.data.student);
      } else {
        setError(res.data.message || "Student not found");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching student");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookDetails = async () => {
    setError("");
    setBookDetails(null);
    if (!accessionNumber.trim()) return;

    try {
      setLoading(true);
      const res = await axios.get(`/api/issues/book/${accessionNumber}`);
      if (res.data.success) {
        setBookDetails(res.data.book);
      } else {
        setError(res.data.message || "Book not found");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching book");
    } finally {
      setLoading(false);
    }
  };

  const addBook = () => {
    if (
      bookDetails &&
      !selectedBooks.some((b) => b._id === bookDetails._id)
    ) {
      setSelectedBooks([...selectedBooks, bookDetails]);
      setAccessionNumber("");
      setBookDetails(null);
    } else {
      setError("Book already selected or invalid.");
    }
  };

  const removeBook = (bookId) => {
    setSelectedBooks((prev) => prev.filter((b) => b._id !== bookId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!studentDetails || selectedBooks.length === 0 || !dueDate) {
      return setError("All fields are required.");
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/issues/issue", {
        studentId: studentDetails._id,
        bookIds: selectedBooks.map((b) => b._id),
        issueDate: getTodayDate(),
        dueDate,
      });

      if (res.data.success) {
        setSuccess("✅ Books issued successfully!");
        setSelectedBooks([]);
        setAccessionNumber("");
        setStudentDetails(null);
        setRollNumber("");
        setDueDate(addDaysToDate(getTodayDate(), 14));
      } else {
        setError(res.data.message || "Failed to issue");
      }
    } catch (err) {
      const backendMsg = err.response?.data?.message;
      const conflict = err.response?.data?.alreadyHasBooks || err.response?.data?.unavailableBooks;
      if (conflict?.length > 0) {
        setError(`${backendMsg}. Conflict with book IDs: ${conflict.join(", ")}`);
      } else {
        setError(backendMsg || "Server error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">📘 Issue Books</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Section */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Roll Number</label>
          <div className="flex">
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              onBlur={fetchStudentDetails}
              className="flex-1 p-2 border rounded-l"
              placeholder="Enter roll number"
              required
            />
            <button
              type="button"
              onClick={fetchStudentDetails}
              className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "..." : "Fetch"}
            </button>
          </div>

          {studentDetails && (
            <div className="mt-2 p-3 bg-blue-50 rounded text-sm">
              <p><strong>Name:</strong> {studentDetails.name}</p>
              <p><strong>Dept:</strong> {studentDetails.department}</p>
              <p><strong>Roll:</strong> {studentDetails.rollNumber}</p>
            </div>
          )}
        </div>

        {/* Book Section */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Accession Number</label>
          <div className="flex">
            <input
              type="text"
              value={accessionNumber}
              onChange={(e) => setAccessionNumber(e.target.value)}
              onBlur={fetchBookDetails}
              className="flex-1 p-2 border rounded-l"
              placeholder="Enter accession number"
            />
            <button
              type="button"
              onClick={fetchBookDetails}
              className="bg-green-600 text-white px-4 rounded-r hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "..." : "Fetch"}
            </button>
          </div>

          {bookDetails && (
            <div className="mt-2 p-3 bg-green-50 rounded text-sm">
              <p><strong>Title:</strong> {bookDetails.bookName}</p>
              <p><strong>Author:</strong> {bookDetails.authorName}</p>
              <p><strong>Accession:</strong> {bookDetails.accessionNumber}</p>
              <button
                type="button"
                onClick={addBook}
                className="mt-2 bg-green-700 text-white px-3 py-1 rounded text-sm"
              >
                ➕ Add Book
              </button>
            </div>
          )}
        </div>

        {/* Selected Books */}
        {selectedBooks.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-1">📚 Selected Books</h4>
            <ul className="space-y-1 text-sm">
              {selectedBooks.map((book) => (
                <li
                  key={book._id}
                  className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"
                >
                  <span>{book.bookName} ({book.accessionNumber})</span>
                  <button
                    type="button"
                    onClick={() => removeBook(book._id)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Issue Date</label>
            <input
              type="text"
              value={getTodayDate()}
              readOnly
              className="w-full p-2 border bg-gray-100 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              value={dueDate}
              min={getTodayDate()}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Messages */}
        {error && (
          <p className="bg-red-100 border border-red-300 p-2 text-red-700 rounded">
            {error}
          </p>
        )}
        {success && (
          <p className="bg-green-100 border border-green-300 p-2 text-green-700 rounded">
            {success}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className={`w-full py-2 rounded text-white font-semibold ${
            loading || !studentDetails || selectedBooks.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading || !studentDetails || selectedBooks.length === 0}
        >
          {loading ? "Issuing..." : "📗 Issue Books"}
        </button>
      </form>
    </div>
  );
};

export default IssueBooks;

