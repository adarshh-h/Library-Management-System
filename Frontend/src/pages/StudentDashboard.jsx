import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const StudentDashboard = () => {
    const [user, setUser] = useState(null);
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data and issued books
        axios.all([
            axios.get("http://localhost:5000/api/student/dashboard", { withCredentials: true }),
            axios.get("http://localhost:5000/api/student/issued-books", { withCredentials: true })
        ])
        .then(axios.spread((userRes, booksRes) => {
            setUser(userRes.data.user);
            setIssuedBooks(booksRes.data.books);
        }))
        .catch(() => navigate("/"))
        .finally(() => setLoading(false));
    }, [navigate]);

    const handleLogout = () => {
        axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true })
            .then(() => navigate("/"))
            .catch(err => console.error("Logout Failed", err));
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
                <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Issues Card */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">📚 My Issued Books</h2>
                    {issuedBooks.length > 0 ? (
                        <ul className="space-y-3">
                            {issuedBooks.map(book => (
                                <li key={book._id} className="border-b pb-3">
                                    <p className="font-medium">{book.bookName}</p>
                                    <p className="text-sm text-gray-600">by {book.authorName}</p>
                                    <p className="text-sm mt-1">
                                        <span className="font-medium">Issued:</span> {new Date(book.issueDate).toLocaleDateString()}
                                    </p>
                                    <p className={`text-sm ${new Date(book.dueDate) < new Date() ? 'text-red-500' : ''}`}>
                                        <span className="font-medium">Due:</span> {new Date(book.dueDate).toLocaleDateString()}
                                        {new Date(book.dueDate) < new Date() && " (Overdue)"}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">You don't have any books issued currently</p>
                    )}
                </div>

                {/* Account and History Card */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">🕒 My History</h2>
                        <Link 
                            to="/student/history" 
                            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            View Issue/Return History
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">👤 My Account</h2>
                        <div className="space-y-2 mb-4">
                            <p><span className="font-medium">Roll No:</span> {user.rollNumber}</p>
                            <p><span className="font-medium">Department:</span> {user.department}</p>
                            <p><span className="font-medium">Email:</span> {user.email}</p>
                            {user.batch && <p><span className="font-medium">Batch:</span> {user.batch}</p>}
                        </div>
                        <Link 
                            to="/student/change-password" 
                            className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-2"
                        >
                            Change Password
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;