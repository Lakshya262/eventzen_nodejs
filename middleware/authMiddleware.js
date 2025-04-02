const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            console.log("Verifying token:", token);
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded token:", decoded);

            req.user = await User.findOne({
                where: { id: decoded.id },
                attributes: ["id", "name", "email", "role"],
            });

            if (!req.user) {
                console.error("User not found for ID:", decoded.id);
                res.status(401);
                throw new Error("User not found");
            }

            console.log("User authenticated:", req.user.email);
            next();
        } catch (error) {
            console.error("Token verification failed:", error.message);
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

module.exports = { protect };