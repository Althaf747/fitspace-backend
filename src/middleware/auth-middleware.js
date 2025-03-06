import jwt from 'jsonwebtoken';
import { prismaClient } from "../application/database.js";
import {logger} from "../application/logging.js";  // Adjust path to your prisma client setup

export const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];  // "Bearer <token>"

    // If no token is provided, respond with a 401 Unauthorized error
    if (!token) {
        return res.status(401).json({
            errors: "Unauthorized: No token provided"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await prismaClient.user.findUnique({
            where: {
                id: decoded.userId,
            }
        });

        if (!user) {
            return res.status(401).json({
                errors: "Unauthorized: User not found"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            errors: "Unauthorized: Invalid or expired token",
            message: error.message
        });
    }
};
