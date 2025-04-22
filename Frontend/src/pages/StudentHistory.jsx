import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/api/student/history", { withCredentials: true })
            .then(res => {
                setTransactions(res.data.transactions);
            })
            .catch(err => {
                console.error("Error fetching history:", err);
                navigate("/student/dashboard");
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Transaction History</h1>
                <button 
                    onClick={() => navigate("/student/dashboard")}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                    Back to Dashboard
                </button>
            </div>

            {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left">Book</th>
                                <th className="py-3 px-4 text-left">Issued On</th>
                                <th className="py-3 px-4 text-left">Due Date</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-left">Returned On</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {transactions.map((txn, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div className="font-medium">{txn.book.bookName}</div>
                                        <div className="text-sm text-gray-600">{txn.book.authorName}</div>
                                        <div className="text-xs text-gray-500">Acc: {txn.book.accessionNumber}</div>
                                    </td>
                                    <td className="py-3 px-4">{new Date(txn.issueDate).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">{new Date(txn.dueDate).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">
                                        {txn.returned ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Returned
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Not Returned
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {txn.returned ? new Date(txn.returnedAt).toLocaleDateString() : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <p className="text-gray-500">No transaction history found</p>
                </div>
            )}
        </div>
    );
};

export default StudentHistory;