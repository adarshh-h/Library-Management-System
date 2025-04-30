 📚 Library Management System
 
A full-stack web application designed for colleges and institutions to manage book issuing, returns, students, and librarian accounts effectively. Built using the MERN stack (MongoDB, Express, React, Node.js).

🚀 Live Demo 
🔗 (https://library-management-system-liart-six.vercel.app/)


🔐 User Access & Authentication

✅ Restricted Signup: There is no public signup to prevent unauthorized access.

👨‍🏫 Librarian accounts are created manually via backend or admin panel.

🎓 Student accounts are created by the librarian (with roll number, department, batch).

🔐 All routes are protected using JWT-based authentication and role-based authorization.

🧩 Features:-

👨‍🏫 Librarian:

Login with secure credentials

Add / View / Bulk Import Students

Add / View / Bulk Import Books

Issue Books (with per-book issue/due tracking)

Return Books (book-wise with date tracking)

Transaction History (view student-wise logs)

Admin Dashboard with all management features

🎓 Student
Login with credentials created by librarian

View personal account details

View currently issued books

View issue/return history with status

Change password securely

🛠️ Tech Stack:

Frontend:	React + Tailwind CSS

Backend:	Express.js (Node.js)

Database:	MongoDB (Atlas)

Auth:	JWT + Cookies



