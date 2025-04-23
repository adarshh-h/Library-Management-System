// import { useEffect, useState } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import axios from "axios";

// const ProtectedRoute = ({ allowedRole }) => {
//     const [sessionValid, setSessionValid] = useState(true);
//     const role = localStorage.getItem("role");

//     useEffect(() => {
//         axios.get("https://library-management-system-ae84.onrender.com/api/auth/check-session", { withCredentials: true })
//             .then((res) => {
//                 if (res.data.user.role !== allowedRole) {
//                     window.location.href = allowedRole === "librarian" ? "/admin-dashboard" : "/student-dashboard";
//                 }
//             })
//             .catch(() => {
//                 localStorage.removeItem("role");
//                 window.location.href = "/";
//                 setSessionValid(false);
//             });
//     }, [allowedRole]);

//     if (!sessionValid) return null;
    
//     return <Outlet />;
// };

// export default ProtectedRoute;

import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ allowedRole }) => {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");

        axios.get("https://library-management-system-ae84.onrender.com/api/auth/check-session", {
            withCredentials: true
        })
            .then((res) => {
                if (res.data.user.role === allowedRole && role === allowedRole) {
                    setAuthorized(true);
                } else {
                    // If wrong role, redirect them to their actual dashboard
                    if (res.data.user.role === "student") {
                        navigate("/student-dashboard");
                    } else if (res.data.user.role === "librarian") {
                        navigate("/admin-dashboard");
                    } else {
                        navigate("/");
                    }
                }
            })
            .catch(() => {
                localStorage.removeItem("role");
                navigate("/");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [allowedRole, navigate]);

    if (loading) {
        return <div className="text-center mt-10 text-xl text-gray-600 animate-pulse">Checking access...</div>;
    }

    return authorized ? <Outlet /> : null;
};

export default ProtectedRoute;
