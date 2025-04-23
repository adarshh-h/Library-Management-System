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

// new 

// const ProtectedRoute = ({ allowedRole }) => {
//     const [isLoading, setIsLoading] = useState(true);
//     const [isValid, setIsValid] = useState(false);
//     const role = localStorage.getItem("role");

//     useEffect(() => {
//         const checkSession = async () => {
//             try {
//                 const res = await axios.get(
//                     "https://library-management-system-ae84.onrender.com/api/auth/check-session", 
//                     { withCredentials: true }
//                 );
                
//                 if (res.data.user.role === allowedRole) {
//                     setIsValid(true);
//                 } else {
//                     window.location.href = "/";
//                 }
//             } catch (error) {
//                 localStorage.removeItem("role");
//                 window.location.href = "/";
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         checkSession();
//     }, [allowedRole]);

//     if (isLoading) return <div>Loading...</div>;
    
//     return isValid ? <Outlet /> : null;
// };
// src/components/ProtectedRoute.js
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ allowedRole }) => {
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const role = localStorage.getItem("role");

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await axios.get(
                    "https://library-management-system-ae84.onrender.com/api/auth/check-session",
                    { withCredentials: true }
                );
                
                if (res.data.user.role === allowedRole) {
                    setIsValid(true);
                } else {
                    window.location.href = "/";
                }
            } catch (error) {
                localStorage.removeItem("role");
                window.location.href = "/";
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, [allowedRole]);

    if (isLoading) return <div>Loading...</div>;
    return isValid ? <Outlet /> : null;
};

export default ProtectedRoute;
