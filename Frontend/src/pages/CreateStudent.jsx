// import { useState } from "react";
// import axios from "axios";

// const CreateStudent = () => {
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [phone, setPhone] = useState("");
//     const [department, setDepartment] = useState("");
//     const [batch, setBatch] = useState("");
//     const [rollNumber, setRollNumber] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [generatedPassword, setGeneratedPassword] = useState("");
//     const [success, setSuccess] = useState("");

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");
//         setSuccess("");

//         try {
//             const response = await axios.post(
//                 "http://localhost:5000/api/admin/create-student",
//                 { name, email, phone, department, batch, rollNumber },
//                 { withCredentials: true }
//             );

//             setGeneratedPassword(response.data.password);
//             setSuccess("Student account created successfully!");
//             resetForm(); // Clear the form after successful submission
//         } catch (error) {
//             setError(error.response?.data?.message || "Failed to create student account.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const resetForm = () => {
//         setName("");
//         setEmail("");
//         setPhone("");
//         setDepartment("");
//         setBatch("");
//         setRollNumber("");
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//             <div className="bg-white p-8 rounded-lg shadow-lg w-96">
//                 <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">Create Student Account</h2>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <input
//                         type="text"
//                         placeholder="Name"
//                         className="w-full p-3 border rounded-lg"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         required
//                     />
//                     <input
//                         type="email"
//                         placeholder="Email"
//                         className="w-full p-3 border rounded-lg"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                     />
//                     <input
//                         type="text"
//                         placeholder="Phone"
//                         className="w-full p-3 border rounded-lg"
//                         value={phone}
//                         onChange={(e) => setPhone(e.target.value)}
//                         required
//                     />
//                     <input
//                         type="text"
//                         placeholder="Department"
//                         className="w-full p-3 border rounded-lg"
//                         value={department}
//                         onChange={(e) => setDepartment(e.target.value)}
//                         required
//                     />
//                     <input
//                         type="text"
//                         placeholder="Batch"
//                         className="w-full p-3 border rounded-lg"
//                         value={batch}
//                         onChange={(e) => setBatch(e.target.value)}
//                         required
//                     />
//                     <input
//                         type="text"
//                         placeholder="Roll Number"
//                         className="w-full p-3 border rounded-lg"
//                         value={rollNumber}
//                         onChange={(e) => setRollNumber(e.target.value)}
//                         required
//                     />
//                     <button
//                         type="submit"
//                         className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center"
//                         disabled={loading}
//                     >
//                         {loading ? "Creating..." : "Create Student"}
//                     </button>
//                     {error && <p className="text-red-500 text-center">{error}</p>}
//                     {success && (
//                         <div className="mt-4 p-4 bg-green-100 rounded-lg">
//                             <p className="text-green-700">
//                                 <strong>Success:</strong> {success}
//                             </p>
//                             <p className="text-sm text-green-600">
//                                 <strong>Student Password:</strong> {generatedPassword}
//                             </p>
//                             </div>
//                     )}
//                             <button
//                                 type="button"
//                                 onClick={resetForm}
//                                 className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
//                             >
//                                 Add Another Student
//                             </button>
                     
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CreateStudent;

import { useState } from "react";
import axios from "axios";

const CreateStudent = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [batch, setBatch] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Predefined list of departments
    const departments = [
        "Computer Science & Engineering",
        "Electrical & Electronics Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Information Technology",
        "Electronics & Communication Engineering",
        "Chemical Engineering",
    ];

    // Validate name (alphabets, spaces, hyphens, and apostrophes)
    const validateName = (name) => {
        const regex = /^[A-Za-z\s'-]+$/;
        return regex.test(name);
    };

    // Validate email format
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Validate phone number (10 digits)
    const validatePhone = (phone) => {
        const regex = /^\d{10}$/;
        return regex.test(phone);
    };

    // Validate batch (format: YYYY-YYYY)
    const validateBatch = (batch) => {
        const regex = /^\d{4}-\d{4}$/;
        return regex.test(batch);
    };

    // Validate roll number (only numbers)
    const validateRollNumber = (rollNumber) => {
        const regex = /^\d+$/;
        return regex.test(rollNumber);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validate inputs
        if (!validateName(name)) {
            setError("Name can only contain alphabets, spaces, hyphens, and apostrophes!");
            setLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address!");
            setLoading(false);
            return;
        }

        if (!validatePhone(phone)) {
            setError("Please enter a valid 10-digit phone number!");
            setLoading(false);
            return;
        }

        if (!department) {
            setError("Please select a department!");
            setLoading(false);
            return;
        }

        if (!validateBatch(batch)) {
            setError("Batch must be in the format YYYY-YYYY (e.g., 2021-2025)!");
            setLoading(false);
            return;
        }

        if (!validateRollNumber(rollNumber)) {
            setError("Roll number can only contain numbers!");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/api/admin/create-student",
                { name, email, phone, department, batch, rollNumber },
                { withCredentials: true }
            );

            // Reset the form after successful submission
            resetForm();
        } catch (error) {
            setError(error.response?.data?.message || "Failed to create student account.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName("");
        setEmail("");
        setPhone("");
        setDepartment("");
        setBatch("");
        setRollNumber("");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">Create Student Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
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
                        placeholder="Phone"
                        className="w-full p-3 border rounded-lg"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        required
                    >
                        <option value="" disabled>Select Department</option>
                        {departments.map((dept, index) => (
                            <option key={index} value={dept}>{dept}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Batch (e.g., 2021-2025)"
                        className="w-full p-3 border rounded-lg"
                        value={batch}
                        onChange={(e) => setBatch(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Roll Number"
                        className="w-full p-3 border rounded-lg"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Student"}
                    </button>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default CreateStudent;