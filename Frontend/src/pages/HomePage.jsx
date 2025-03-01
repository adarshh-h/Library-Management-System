import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    // ✅ Redirect logged-in users to their dashboard
    useEffect(() => {
        if (role === "librarian") navigate("/admin-dashboard");
        if (role === "student") navigate("/student-dashboard");
    }, [role, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Library Management System</h1>
            <div className="space-y-4">
                <button onClick={() => navigate("/librarian-login")} className="w-64 p-4 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-lg shadow-lg">
                    Librarian Login
                </button>
                <button onClick={() => navigate("/student-login")} className="w-64 p-4 bg-green-500 hover:bg-green-600 text-white text-lg rounded-lg shadow-lg">
                    Student Login
                </button>
            </div>
        </div>
    );
};

export default HomePage;
