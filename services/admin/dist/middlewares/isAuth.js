import jwt from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Please login - no authheader",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({
                message: "Please login - token missing",
            });
            return;
        }
        const decodedValue = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedValue || !decodedValue.user) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }
        req.user = decodedValue.user;
        next();
    }
    catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
};
export const isAdmin = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                message: "Unauthorized"
            });
            return;
        }
        if (user.role !== "admin") {
            res.status(403).json({
                message: "Access denied"
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
};
