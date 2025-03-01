import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterLibrarian = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/auth/register-librarian", { 
                name, 
                email, 
                phone, 
                department, 
                password 
            });
            
            alert("Librarian registration successful! Please login.");
            navigate("/login");
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed!");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">Librarian Registration</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full p-3 border rounded-lg"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border rounded-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Phone Number"
                        className="w-full p-3 border rounded-lg"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Department"
                        className="w-full p-3 border rounded-lg"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border rounded-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center mt-4 text-gray-600">
                    Already have an account? <a href="/login" className="text-blue-600 font-semibold">Login</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterLibrarian;
