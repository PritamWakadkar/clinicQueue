import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.json({
                success: false,
                message: "Not Authorized. Please login again."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (decoded !== process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD) {
            return res.json({
                success: false,
                message: "Invalid Token"
            });
        }

        next();

    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};

export default authAdmin;