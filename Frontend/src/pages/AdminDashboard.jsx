import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/api/admin/dashboard", { withCredentials: true })
            .then(res => setUser(res.data.user)) // ✅ Set user correctly
            .catch(() => navigate("/")); // ✅ Redirect if unauthorized
    }, [navigate]);

    if (!user) return <h2 className="text-center mt-10 text-red-600">Loading...</h2>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Welcome, {user.name} (Librarian)!</h1> {/* ✅ Fixed */}
            <div className="mt-6 space-y-4">
                <button
                    onClick={() => navigate("/create-student")} // Navigate to Create Student page
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Create Student
                </button>
                <button
                    onClick={() => axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true })
                        .then(() => navigate("/"))
                        .catch(err => console.error("Logout Failed", err))}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;