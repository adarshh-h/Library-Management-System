// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   UserPlus, Users, Upload, LogOut,
//   BookOpen, Book, ArrowDownUp, CornerDownLeft
// } from "lucide-react";

// const AdminDashboard = () => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   useEffect(() => {
//     const checkSession = async () => {
//         try {
//             const res = await axios.get(
//                 "https://library-management-system-ae84.onrender.com/api/auth/check-session",
//                 { withCredentials: true }
//             );
//             setUser(res.data.user);
//         } catch (error) {
//             localStorage.removeItem("role");
//             navigate("/");
//         }
//     };
    
//     checkSession();
// }, [navigate]);

//   // useEffect(() => {
//   //   axios.get("https://library-management-system-ae84.onrender.com/api/admin/dashboard", { withCredentials: true })
//   //     .then(res => setUser(res.data.user))
//   //     .catch(() => navigate("/"));
//   // }, [navigate]);

//   // const handleLogout = () => {
//   //   axios.post("https://library-management-system-ae84.onrender.com/api/auth/logout", {}, { withCredentials: true })
//   //     .then(() => navigate("/"))
//   //     .catch(err => console.error("Logout Failed", err));
//   // };
//   const handleLogout = async () => {
//     try {
//         await axios.post(
//             "https://library-management-system-ae84.onrender.com/api/auth/logout", 
//             {}, 
//             { 
//                 withCredentials: true,
//                 headers: {
//                     "Content-Type": "application/json"
//                 }
//             }
//         );
        
//         // Clear local storage
//         localStorage.removeItem("role");
        
//         // Force a hard redirect to ensure complete logout
//         window.location.href = "/";
//     } catch (err) {
//         console.error("Logout Failed", err);
//         // Fallback redirect if logout fails
//         window.location.href = "/";
//     }
// };

//   if (!user) {
//     return <h2 className="text-center mt-10 text-xl text-gray-600 animate-pulse">Loading...</h2>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-10 px-4">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-4xl font-bold text-blue-800 mb-10 text-center drop-shadow-sm">
//           📚 Welcome, {user.name} <span className="text-sm font-light">(Librarian)</span>
//         </h1>

//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* User Management */}
//           <DashboardCard
//             title="Add Librarian"
//             icon={<UserPlus className="w-6 h-6" />}
//             onClick={() => navigate("/add-librarian")}
//             color="bg-purple-600"
//           />
//           <DashboardCard
//             title="Create Student"
//             icon={<UserPlus className="w-6 h-6" />}
//             onClick={() => navigate("/create-student")}
//             color="bg-blue-600"
//           />
//           <DashboardCard
//             title="View Students"
//             icon={<Users className="w-6 h-6" />}
//             onClick={() => navigate("/view-students")}
//             color="bg-green-600"
//           />
//           <DashboardCard
//             title="Bulk Import Students"
//             icon={<Upload className="w-6 h-6" />}
//             onClick={() => navigate("/bulk-import-students")}
//             color="bg-yellow-500"
//           />

//           {/* Book Management */}
//           <DashboardCard
//             title="View Books"
//             icon={<Book className="w-6 h-6" />}
//             onClick={() => navigate("/view-books")}
//             color="bg-indigo-500"
//           />
//           <DashboardCard
//             title="Bulk Import Books"
//             icon={<Upload className="w-6 h-6" />}
//             onClick={() => navigate("/bulk-import-books")}
//             color="bg-indigo-600"
//           />
//           <DashboardCard
//             title="Issue Books"
//             icon={<ArrowDownUp className="w-6 h-6" />}
//             onClick={() => navigate("/issue-books")}
//             color="bg-pink-500"
//           />
//           <DashboardCard
//             title="Return Books"
//             icon={<CornerDownLeft className="w-6 h-6" />}
//             onClick={() => navigate("/return-books")}
//             color="bg-orange-500"
//           />

//           {/* Other Features (Optional Scope) */}
//           <DashboardCard
//             title="Transaction History"
//             icon={<BookOpen className="w-6 h-6" />}
//             onClick={() => navigate("/history-books")}
//             color="bg-blue-700"
//           />

//           {/* Logout */}
//           <DashboardCard
//             title="Logout"
//             icon={<LogOut className="w-6 h-6" />}
//             onClick={handleLogout}
//             color="bg-red-600"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const DashboardCard = ({ title, icon, onClick, color }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center justify-between px-5 py-4 rounded-xl shadow-lg text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 ${color}`}
//     aria-label={title}
//   >
//     <span className="text-lg font-medium">{title}</span>
//     {icon}
//   </button>
// );

// export default AdminDashboard;
// DashboardCard component remains unchanged

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserPlus, Users, Upload, LogOut,
  BookOpen, Book, ArrowDownUp, CornerDownLeft
} from "lucide-react";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        // Changed to use the admin dashboard endpoint
        const res = await axios.get(
          "https://library-management-system-ae84.onrender.com/api/admin/dashboard", 
          { 
            withCredentials: true,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log("Session response:", res.data); // Debug log
        
        if (res.data?.user) {
          setUser(res.data.user);
        } else {
          throw new Error("Invalid user data received");
        }
      } catch (error) {
        console.error("Session check error:", error);
        setError("Failed to load user data");
        localStorage.removeItem("role");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "https://library-management-system-ae84.onrender.com/api/auth/logout", 
        {}, 
        { 
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      
      console.log("Logout response:", response.data); // Debug log
      
      localStorage.removeItem("role");
      // Force full page reload to clear all state
      window.location.href = "/";
    } catch (err) {
      console.error("Logout Failed", err);
      // Fallback redirect if logout fails
      window.location.href = "/";
    }
  };

  if (loading) {
    return <h2 className="text-center mt-10 text-xl text-gray-600 animate-pulse">Loading...</h2>;
  }

  if (error) {
    return <h2 className="text-center mt-10 text-xl text-red-600">{error}</h2>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Made username display more resilient with fallback */}
        <h1 className="text-4xl font-bold text-blue-800 mb-10 text-center drop-shadow-sm">
          📚 Welcome, {user?.name || 'Administrator'} <span className="text-sm font-light">(Librarian)</span>
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Management Cards - unchanged */}
          <DashboardCard
            title="Add Librarian"
            icon={<UserPlus className="w-6 h-6" />}
            onClick={() => navigate("/add-librarian")}
            color="bg-purple-600"
          />
         <DashboardCard
            title="Create Student"
            icon={<UserPlus className="w-6 h-6" />}
            onClick={() => navigate("/create-student")}
            color="bg-blue-600"
          />
          <DashboardCard
            title="View Students"
            icon={<Users className="w-6 h-6" />}
            onClick={() => navigate("/view-students")}
            color="bg-green-600"
          />
          <DashboardCard
            title="Bulk Import Students"
            icon={<Upload className="w-6 h-6" />}
            onClick={() => navigate("/bulk-import-students")}
            color="bg-yellow-500"
          />

          {/* Book Management */}
          <DashboardCard
            title="View Books"
            icon={<Book className="w-6 h-6" />}
            onClick={() => navigate("/view-books")}
            color="bg-indigo-500"
          />
          <DashboardCard
            title="Bulk Import Books"
            icon={<Upload className="w-6 h-6" />}
            onClick={() => navigate("/bulk-import-books")}
            color="bg-indigo-600"
          />
          <DashboardCard
            title="Issue Books"
            icon={<ArrowDownUp className="w-6 h-6" />}
            onClick={() => navigate("/issue-books")}
            color="bg-pink-500"
          />
          <DashboardCard
            title="Return Books"
            icon={<CornerDownLeft className="w-6 h-6" />}
            onClick={() => navigate("/return-books")}
            color="bg-orange-500"
          />

          {/* Other Features (Optional Scope) */}
          <DashboardCard
            title="Transaction History"
            icon={<BookOpen className="w-6 h-6" />}
            onClick={() => navigate("/history-books")}
            color="bg-blue-700"
          />

          {/* Logout */}
          <DashboardCard
            title="Logout"
            icon={<LogOut className="w-6 h-6" />}
            onClick={handleLogout}
            color="bg-red-600"
          />
        </div>
      </div>
    </div>
  );
};

// DashboardCard component remains unchanged
const DashboardCard = ({ title, icon, onClick, color }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between px-5 py-4 rounded-xl shadow-lg text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 ${color}`}
    aria-label={title}
  >
    <span className="text-lg font-medium">{title}</span>
    {icon}
  </button>
);

export default AdminDashboard;
