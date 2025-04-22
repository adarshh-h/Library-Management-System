import { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const newPassRef = useRef();
  const confirmPassRef = useRef();
  const currentPassRef = useRef();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const { currentPassword, newPassword, confirmPassword } = form;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("⚠️ Please fill in all the fields");
      currentPassRef.current.focus();
      return false;
    }

    if (newPassword.length < 8) {
      toast.warning("🔐 Password must be at least 8 characters");
      newPassRef.current.focus();
      return false;
    }

    if (newPassword === currentPassword) {
      toast.warning("🔄 New password must be different from current password");
      newPassRef.current.focus();
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error("❌ Passwords do not match");
      confirmPassRef.current.focus();
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const { currentPassword, newPassword } = form;
      const res = await axios.post(
        "http://localhost:5000/api/student/change-password",
        { currentPassword, newPassword },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("✅ Password changed successfully");
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "❌ Failed to change password";
      toast.error(errorMessage);
      
      // Focus the appropriate field based on error
      if (errorMessage.toLowerCase().includes("current")) {
        currentPassRef.current.focus();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        🔐 Change Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5" aria-label="Change Password Form">
        {/* Current Password */}
        <div className="relative">
          <label htmlFor="currentPassword" className="block mb-1 font-medium text-gray-700">
            Current Password
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              name="currentPassword"
              ref={currentPassRef}
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full p-2 pr-10 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
              aria-label={showPasswords.current ? "Hide password" : "Show password"}
            >
              {showPasswords.current ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="relative">
          <label htmlFor="newPassword" className="block mb-1 font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              ref={newPassRef}
              autoComplete="new-password"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full p-2 pr-10 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password (min 8 characters)"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
              aria-label={showPasswords.new ? "Hide password" : "Show password"}
            >
              {showPasswords.new ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label htmlFor="confirmPassword" className="block mb-1 font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              ref={confirmPassRef}
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 pr-10 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
              aria-label={showPasswords.confirm ? "Hide password" : "Show password"}
            >
              {showPasswords.confirm ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white font-semibold transition-all flex items-center justify-center ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </>
          ) : (
            "🔄 Update Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;