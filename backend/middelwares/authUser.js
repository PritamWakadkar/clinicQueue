import jwt from "jsonwebtoken";

// User authentication middleware
const authUser = async (req, res, next) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.json({
                success: false,
                message: "Not Authorized. Please login again."
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );

        // Store user ID in request
        req.userId = decoded.id || decoded._id;

        next();

    } catch (error) {
        console.log("AUTH ERROR:", error);

        return res.json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default authUser;