const jwt = require("jsonwebtoken");
const JWT_SECRET = "mazhar518";

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers?.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization header missing or malformed" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = await jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = verifyToken;
