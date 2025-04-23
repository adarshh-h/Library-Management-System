import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const AddLibrarian = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    // Department options for the dropdown
    const departmentOptions = [
        { value: "Computer Science & Engineering", label: "Computer Science & Engineering" },
        { value: "Information Technology", label: "Information Technology" },

    ];

    // Validation schema using Yup
    const validationSchema = yup.object().shape({
        name: yup
            .string()
            .matches(/^[A-Za-z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
            .required("Name is required"),
        email: yup
            .string()
            .email("Invalid email")
            .required("Email is required"),
        phone: yup
            .string()
            .matches(/^\d{10}$/, "Phone number must be 10 digits")
            .required("Phone is required"),
        password: yup
            .string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
        department: yup
            .string()
            .required("Department is required"),
    });

    const handleSubmit = async (values) => {
        setError("");
        setSuccess("");

        try {
            const response = await axios.post(
                "https://library-management-system-ae84.onrender.com/api/admin/create-librarian",
                values,
                { withCredentials: true }
            );

            if (response.status === 201) {
                toast.success("Librarian created successfully!"); // Success toast
                setTimeout(() => navigate("/admin-dashboard"), 2000); // Redirect to admin dashboard after 2 seconds
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create librarian. Please try again."); // Error toast
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Add Librarian</h1>
            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}

            {/* Formik Form */}
            <Formik
                initialValues={{
                    name: "",
                    email: "",
                    phone: "",
                    password: "",
                    department: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <Field
                                type="text"
                                name="name"
                                placeholder="Enter name"
                                className="w-full p-2 border rounded"
                                pattern="[A-Za-z\s'-]+"
                                title="Name can only contain letters, spaces, hyphens, and apostrophes"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-600 text-sm" />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <Field
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                className="w-full p-2 border rounded"
                            />
                            <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <Field
                                type="tel"
                                name="phone"
                                placeholder="Enter phone number"
                                className="w-full p-2 border rounded"
                                pattern="\d{10}"
                                title="Phone number must be 10 digits"
                            />
                            <ErrorMessage name="phone" component="div" className="text-red-600 text-sm" />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <Field
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                className="w-full p-2 border rounded"
                            />
                            <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
                        </div>

                        {/* Department Field */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Department</label>
                            <Field name="department">
                                {({ field, form }) => (
                                    <Select
                                        options={departmentOptions}
                                        value={departmentOptions.find(option => option.value === field.value)}
                                        onChange={(option) => form.setFieldValue(field.name, option.value)}
                                        onBlur={field.onBlur}
                                        className="w-full"
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="department" component="div" className="text-red-600 text-sm" />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Add Librarian
                        </button>
                    </Form>
                )}
            </Formik>
            <ToastContainer /> {/* Add this line */}
        </div>
    );
};

export default AddLibrarian;
