import jwt from "jsonwebtoken";

const authDoc = async (req, res, next) => {
    try {
        const dtoken = req.headers.token;

        if (!dtoken) {
            return res.json({
                success: false,
                message: "Not Authorized. Please login again.",
            });
        }

        const decoded = jwt.verify(
            dtoken,
            process.env.JWT_SECRET_KEY
        );

        // Store doctor ID in request
        req.docId = decoded.id;

        next();

    } catch (error) {
        console.log("AUTH ERROR:", error);

        return res.json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

export default authDoc;