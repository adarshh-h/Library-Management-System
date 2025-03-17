const jwt = require("jsonwebtoken");
const User = require("../models/User"); // ✅ Ensure User model is imported

const protect = (role) => async (req, res, next) => {
    const token = req.cookies.token; // ✅ Extract token from cookies

    if (!token) return res.status(401).json({ message: "Unauthorized. Please log in." });

    try {
        // ✅ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Fetch full user details from DB (exclude password)
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found." });

        // ✅ Check if user role matches required role
        if (user.role !== role) return res.status(403).json({ message: `Access denied. Requires ${role} role.` });

        req.user = user; // ✅ Attach user object to request
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expired. Please log in again." });
        }
        res.status(401).json({ message: "Invalid token." });
    }
};

module.exports = { protect };
