import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LibrarianLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/auth/librarian-login", 
                { email, password }, 
                { withCredentials: true } // ✅ Sends cookies automatically
            );

            localStorage.setItem("role", "librarian"); // ✅ Store role for frontend use
            navigate("/admin-dashboard", { replace: true });
        } catch (error) {
            alert(error.response?.data?.message || "Login failed!");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">Librarian Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LibrarianLogin;
