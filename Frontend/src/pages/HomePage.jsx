import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "librarian") navigate("/admin-dashboard");
    else if (role === "student") navigate("/student-dashboard");
  }, [role, navigate]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 p-6">
      <section className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4 drop-shadow-sm tracking-tight">
          📚 Library Management System
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Manage book issues, returns, and student records with ease. Choose your role to continue.
        </p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2 w-full max-w-lg">
        <RoleCard
          label="Librarian Login"
          color="bg-blue-600"
          hoverColor="hover:bg-blue-700"
          onClick={() => navigate("/librarian-login")}
          ariaLabel="Login as librarian"
        />
        <RoleCard
          label="Student Login"
          color="bg-green-600"
          hoverColor="hover:bg-green-700"
          onClick={() => navigate("/student-login")}
          ariaLabel="Login as student"
        />
      </div>
    </main>
  );
};

const RoleCard = ({ label, onClick, color, hoverColor, ariaLabel }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className={`flex items-center justify-center gap-3 px-6 py-4 text-white text-lg font-semibold rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${color} ${hoverColor}`}
  >
    <LogIn className="w-5 h-5" />
    {label}
  </button>
);

export default HomePage;
