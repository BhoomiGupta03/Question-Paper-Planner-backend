import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    console.log(token)
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid token" });
    }
};
