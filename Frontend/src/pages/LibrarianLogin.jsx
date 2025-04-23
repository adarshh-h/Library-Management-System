import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import axios from "axios";

const LibrarianLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // const handleLogin = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setError("");

    //     try {
    //         await axios.post(
    //             "https://library-management-system-ae84.onrender.com/api/auth/librarian-login",
    //             { email, password },
    //             { withCredentials: true }
    //         );

    //         localStorage.setItem("role", "librarian");
    //         navigate("/admin-dashboard", { replace: true });
    //     } catch (error) {
    //         setError(error.response?.data?.message || "Login failed!");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
        const response = await axios.post(
            "https://library-management-system-ae84.onrender.com/api/auth/librarian-login",
            { email, password },
            { 
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );

        // Add debug logging
        console.log("Login response:", response);
        console.log("Cookies:", document.cookie);

        if (response.data && response.data.user) {
            localStorage.setItem("role", "librarian");
            // Add timeout to allow cookie to be set
            setTimeout(() => {
                navigate("/admin-dashboard", { replace: true });
            }, 100);
        }
    } catch (error) {
        console.error("Full error:", error);
        setError(error.response?.data?.message || "Login failed!");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">Librarian Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border rounded-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg
                                    className="animate-spin h-5 w-5 mr-3 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Loading...
                            </span>
                        ) : (
                            "Login"
                        )}
                    </button>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                </form>
                {/* Add "Forgot Password" link */}
                <div className="mt-4 text-center">
                    <Link to="/forgot-password" className="text-blue-500 hover:text-blue-600">
                        Forgot Password?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LibrarianLogin;
