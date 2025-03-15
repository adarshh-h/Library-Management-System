import { useState } from "react";
import axios from "axios";

const BulkImportBooks = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [importResults, setImportResults] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setImportResults(null);

        if (!file) {
            setError("Please upload a CSV file!");
            return;
        }

        // Ensure file type is CSV
        if (!file.name.endsWith(".csv")) {
            setError("Invalid file format! Please upload a .csv file.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const { data } = await axios.post(
                "http://localhost:5000/api/books/bulk-import-books",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );

            setMessage(data.message);
            setImportResults({
                inserted: data.inserted || 0,
                duplicates: data.duplicates || 0,
                errors: data.errors || 0,
                duplicateEntries: data.duplicateEntries || [],
                errorEntries: data.errorEntries || [],
            });
        } catch (error) {
            setError(error.response?.data?.message || "Failed to import books!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">
                    Bulk Import Books
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="file"
                        accept=".csv"
                        className="w-full p-3 border rounded-lg"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
                        disabled={loading}
                    >
                        {loading ? "Importing Books..." : "Import Books"}
                    </button>

                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {message && <p className="text-green-500 text-center">{message}</p>}

                    {importResults && (
                        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                            <h3 className="text-lg font-semibold mb-2">Import Summary:</h3>
                            <p className="text-green-600">✅ Inserted: {importResults.inserted}</p>
                            <p className="text-yellow-600">⚠️ Duplicates: {importResults.duplicates}</p>
                            <p className="text-red-600">❌ Errors: {importResults.errors}</p>

                            {/* Show duplicate entries */}
                            {importResults.duplicateEntries.length > 0 && (
                                <div className="mt-2">
                                    <h4 className="font-medium">Duplicate Entries Skipped:</h4>
                                    <ul className="text-sm text-gray-700 max-h-40 overflow-auto border p-2 rounded-lg">
                                        {importResults.duplicateEntries.map((entry, index) => (
                                            <li key={index}>
                                                📌 {entry.accessionNumber || "Unknown Accession Number"} - {entry.error}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Show errors */}
                            {importResults.errorEntries.length > 0 && (
                                <div className="mt-2">
                                    <h4 className="font-medium">Errors Found:</h4>
                                    <ul className="text-sm text-gray-700 max-h-40 overflow-auto border p-2 rounded-lg">
                                        {importResults.errorEntries.map((entry, index) => (
                                            <li key={index}>
                                                ❌ {entry.accessionNumber || "Unknown Accession Number"} - {entry.error}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default BulkImportBooks;
