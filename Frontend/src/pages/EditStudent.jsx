import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditStudent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/admin/students/${id}`, { withCredentials: true });
                if (response.data) {
                    setStudent(response.data);
                } else {
                    setError("Student not found.");
                }
            } catch (error) {
                setError("Failed to fetch student details.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/admin/students/${id}`, student, { withCredentials: true });
            navigate("/view-students");
        } catch (error) {
            setError("Failed to update student.");
        }
    };

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Edit Student</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={student.name}
                    onChange={(e) => setStudent({ ...student, name: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={student.email}
                    onChange={(e) => setStudent({ ...student, email: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    required
                />
                <input
                    type="text"
                    placeholder="Phone"
                    value={student.phone}
                    onChange={(e) => setStudent({ ...student, phone: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    required
                />
                <input
                    type="text"
                    placeholder="Department"
                    value={student.department}
                    onChange={(e) => setStudent({ ...student, department: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    required
                />
                <input
                    type="text"
                    placeholder="Batch"
                    value={student.batch}
                    onChange={(e) => setStudent({ ...student, batch: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    required
                />
                <input
                    type="text"
                    placeholder="Roll Number"
                    value={student.rollNumber}
                    onChange={(e) => setStudent({ ...student, rollNumber: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    required
                />
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                    Update Student
                </button>
            </form>
        </div>
    );
};

export default EditStudent;