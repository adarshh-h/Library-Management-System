import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LibrarianLogin from "./pages/LibrarianLogin";
import StudentLogin from "./pages/StudentLogin";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import CreateStudent from "./pages/CreateStudent";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewStudents from "./pages/ViewStudents";
import EditStudent from "./pages/EditStudent";
import BulkImportStudents from "./pages/BulkImportStudents";
import AddLibrarian from "./pages/AddLibrarian";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

import BulkImportBooks from "./pages/BulkImportBooks";

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/librarian-login" element={<LibrarianLogin />} />
                <Route path="/student-login" element={<StudentLogin />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />


                {/* Protected Routes for Librarian */}
                <Route element={<ProtectedRoute allowedRole="librarian" />}>
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/create-student" element={<CreateStudent />} />
                    <Route path="/view-students" element={<ViewStudents />} />
                    <Route path="/edit-student/:id" element={<EditStudent />} />
                    <Route path="/bulk-import-students" element={<BulkImportStudents />} />
                    <Route path="/add-librarian" element={<AddLibrarian />} />
                 
                    <Route path="/bulk-import-books" element={<BulkImportBooks />} />
                  

                </Route>

                {/* Protected Routes for Student */}
                <Route element={<ProtectedRoute allowedRole="student" />}>
                    <Route path="/student-dashboard" element={<StudentDashboard />} />
                </Route>

                {/* Catch-all Route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;

