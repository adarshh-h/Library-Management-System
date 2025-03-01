import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LibrarianLogin from "./pages/LibrarianLogin";
import StudentLogin from "./pages/StudentLogin";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/librarian-login" element={<LibrarianLogin />} />
                <Route path="/student-login" element={<StudentLogin />} />
                <Route element={<ProtectedRoute allowedRole="librarian" />}>
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                </Route>
                <Route element={<ProtectedRoute allowedRole="student" />}>
                    <Route path="/student-dashboard" element={<StudentDashboard />} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
