
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sequelize = require("../config/database");
const db = require('../models');
const User = db.User;

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ 
            where: sequelize.where(
                sequelize.fn('LOWER', sequelize.col('email')),
                sequelize.fn('LOWER', email)
            )
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                error: "User already exists",
                existingRole: existingUser.role
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = (role && role.toUpperCase() === "ADMIN") ? "ADMIN" : "CUSTOMER";

        const newUser = await User.create({ 
            name, 
            email: email.toLowerCase(),
            password: hashedPassword, 
            role: userRole
        });

        const token = jwt.sign(
            { 
                id: newUser.id, 
                email: newUser.email, 
                role: newUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        res.status(201).json({ 
            token, 
            role: newUser.role,
            message: "Registration successful" 
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            error: "Server error",
            details: error.message 
        });
    }
};

// Enhanced User Login
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ 
        where: { email: email.toLowerCase() },
        attributes: ['id', 'name', 'email', 'password', 'role'] 
      });
  
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.json({
        token,
        role: user.role,
        userId: user.id,
        email: user.email,
        name: user.name
      });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email', 'role', 'createdAt'],
            raw: true
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile data' });
    }
};