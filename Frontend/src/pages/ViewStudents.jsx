import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/admin/students", { withCredentials: true });
                setStudents(response.data);
            } catch (error) {
                setError("Failed to fetch students.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleEdit = (id) => {
        navigate(`/edit-student/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/students/${id}`, { withCredentials: true });
            setStudents(students.filter(student => student._id !== id));
        } catch (error) {
            setError("Failed to delete student.");
        }
    };

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">View Students</h1>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-3">Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Batch</th>
                        <th className="p-3">Roll Number</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student._id} className="border-b">
                            <td className="p-3">{student.name}</td>
                            <td className="p-3">{student.email}</td>
                            <td className="p-3">{student.department}</td>
                            <td className="p-3">{student.batch}</td>
                            <td className="p-3">{student.rollNumber}</td>
                            <td className="p-3">
                                <button
                                    onClick={() => handleEdit(student._id)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(student._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewStudents;