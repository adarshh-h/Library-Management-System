// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

// const HistorySearch = () => {
//   const [rollNumber, setRollNumber] = useState("");
//   const [student, setStudent] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     axios.defaults.withCredentials = true;
//     axios.defaults.baseURL = "http://localhost:5000";
//   }, []);

//   const fetchHistory = async () => {
//     if (!rollNumber.trim()) {
//       toast.error("Please enter a roll number");
//       return;
//     }

//     try {
//       setLoading(true);
//       setStudent(null);
//       setTransactions([]);

//       const studentRes = await axios.get(`/api/issues/student-by-roll/${rollNumber}`);
//       if (!studentRes.data.success) {
//         toast.error("Student not found");
//         return;
//       }

//       const studentData = studentRes.data.student;
//       setStudent(studentData);

//       const historyRes = await axios.get(`/api/history/history/${studentData._id}`);
//       if (!historyRes.data.success || !historyRes.data.transactions?.length) {
//         toast.info("No transaction history found for this student");
//         return;
//       }

//       setTransactions(historyRes.data.transactions);
//       toast.success(`Found ${historyRes.data.transactions.length} transactions`);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Error fetching history");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Format date as dd-mm-yyyy
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6">📚 Student Transaction History</h2>

//       {/* Search */}
//       <div className="mb-6 flex gap-3 items-center">
//         <input
//           type="text"
//           placeholder="Enter Student Roll Number"
//           value={rollNumber}
//           onChange={(e) => setRollNumber(e.target.value)}
//           className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={fetchHistory}
//           disabled={loading}
//           className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
//         >
//           {loading ? "Searching..." : "Search History"}
//         </button>
//       </div>

//       {/* Student Info */}
//       {student && (
//         <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//           <h3 className="font-bold text-lg text-blue-800 mb-2">Student Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//             <p><span className="font-medium">Name:</span> {student.name}</p>
//             <p><span className="font-medium">Roll No:</span> {student.rollNumber}</p>
//             <p><span className="font-medium">Department:</span> {student.department}</p>
//             {student.batch && <p><span className="font-medium">Batch:</span> {student.batch}</p>}
//           </div>
//         </div>
//       )}

//       {/* Transaction Table */}
//       {transactions.length > 0 ? (
//         <div className="space-y-4">
//           <h3 className="text-xl font-semibold mb-2">Transaction History</h3>

//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white rounded-lg overflow-hidden">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="py-2 px-4 text-left">Book</th>
//                   <th className="py-2 px-4 text-left">Issued On</th>
//                   <th className="py-2 px-4 text-left">Due On</th>
//                   <th className="py-2 px-4 text-left">Status</th>
//                   <th className="py-2 px-4 text-left">Returned On</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {transactions.map((txn, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="py-3 px-4">
//                       <div className="font-medium">{txn.book.bookName}</div>
//                       <div className="text-sm text-gray-600">{txn.book.authorName}</div>
//                       <div className="text-xs text-gray-500">Acc: {txn.book.accessionNumber}</div>
//                     </td>
//                     <td className="py-3 px-4">{formatDate(txn.issueDate)}</td>
//                     <td className="py-3 px-4">{formatDate(txn.dueDate)}</td>
//                     <td className="py-3 px-4">
//                       {txn.returned ? (
//                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                           Returned
//                         </span>
//                       ) : (
//                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                           Not Returned
//                         </span>
//                       )}
//                     </td>
//                     <td className="py-3 px-4">
//                       {txn.returned ? formatDate(txn.returnedAt) : "-"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : student && (
//         <div className="p-4 bg-gray-100 rounded-lg text-center">
//           <p className="text-gray-600">No transaction history found for this student</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HistorySearch;

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const HistorySearch = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = "http://localhost:5000";
  }, []);

  const fetchHistory = async () => {
    if (!rollNumber.trim()) {
      toast.warning("Please enter a roll number");
      return;
    }

    try {
      setLoading(true);
      setStudent(null);
      setTransactions([]);
      setHasSearched(true);

      const studentRes = await axios.get(`/api/issues/student-by-roll/${rollNumber}`);
      if (!studentRes.data.success) {
        toast.error("Student not found");
        return;
      }

      const studentData = studentRes.data.student;
      setStudent(studentData);

      const historyRes = await axios.get(`/api/history/history/${studentData._id}`);
      if (!historyRes.data.success) {
        toast.info(historyRes.data.message || "No transaction history available");
        return;
      }

      setTransactions(historyRes.data.transactions || []);
      if (historyRes.data.transactions?.length) {
        toast.success(`Found ${historyRes.data.transactions.length} transactions`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📚 Student Transaction History</h2>

      {/* Search Section */}
      <div className="mb-6 flex gap-3 items-center">
        <input
          type="text"
          placeholder="Enter Student Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && fetchHistory()}
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={fetchHistory}
          disabled={loading}
          className={`px-6 py-3 rounded-lg text-white font-medium ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </span>
          ) : (
            "Search History"
          )}
        </button>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Student Info */}
          {student && (
            <div className="bg-blue-50 p-6 border-b">
              <h3 className="text-xl font-bold text-blue-800 mb-3">Student Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="font-medium">{student.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Roll Number</p>
                  <p className="font-medium">{student.rollNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="font-medium">{student.department}</p>
                </div>
                {student.batch && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Batch</p>
                    <p className="font-medium">{student.batch}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Transaction Content */}
          <div className="p-6">
            {transactions.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Transaction History</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {transactions.length} records
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued On</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due On</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returned On</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((txn, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{txn.book.bookName}</div>
                            <div className="text-sm text-gray-500">{txn.book.authorName}</div>
                            <div className="text-xs text-gray-400">Acc: {txn.book.accessionNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(txn.issueDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(txn.dueDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {txn.returned ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Returned
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Not Returned
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {txn.returned ? formatDate(txn.returnedAt) : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : student ? (
              <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Transaction History</h3>
                <p className="text-gray-500">This student has no recorded book transactions.</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Student Not Found</h3>
                <p className="text-gray-500">No student found with this roll number. Please verify and try again.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorySearch;