import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BulkImportStudents = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [duplicates, setDuplicates] = useState([]);
    const [validationErrors, setValidationErrors] = useState([]);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a file!");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");
        setDuplicates([]);
        setValidationErrors([]);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:5000/api/admin/bulk-import-students", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            setSuccess(`Successfully created ${response.data.created} students!`);
            setDuplicates(response.data.duplicates);
            setValidationErrors(response.data.errors);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to import students.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">Bulk Import Students</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="w-full p-3 border rounded-lg"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? "Importing..." : "Import Students"}
                    </button>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {success && <p className="text-green-500 text-center">{success}</p>}

                    {/* Display Duplicates */}
                    {duplicates.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Duplicate Emails:</h3>
                            <ul className="list-disc pl-5">
                                {duplicates.map((dup, index) => (
                                    <li key={index} className="text-red-500">
                                        {dup.student.email} - {dup.error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Display Validation Errors */}
                    {validationErrors.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Validation Errors:</h3>
                            <ul className="list-disc pl-5">
                                {validationErrors.map((err, index) => (
                                    <li key={index} className="text-red-500">
                                        {err.row.email} - {err.error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default BulkImportStudents;