const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.refreshToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) return next();
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // if token is marked as fresh
        if (decoded.fresh) {
            req.user = decoded;
            return next();
        }
        
        // If token isn't fresh, get current user data
        const currentUser = await User.findByPk(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ message: "User not found" });
        }
        
        // Generate new fresh token
        const newToken = jwt.sign(
            {
                id: currentUser.id,
                email: currentUser.email,
                role: currentUser.role,
                fresh: true
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );
        
        // Attach new token to response
        res.set('X-New-Token', newToken);
        req.user = {
            id: currentUser.id,
            email: currentUser.email,
            role: currentUser.role
        };
        
        next();
    } catch (error) {
        console.error("Token refresh error:", error);
        next();
    }
};

