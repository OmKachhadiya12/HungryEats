import { Request,Response,NextFunction } from "express";
import jwt , { JwtPayload } from "jsonwebtoken";

export interface IUSER {
    _id: string;
    name: string;
    email: string;
    image: string;
    role: string;
    restaurantId: string
}

export interface AuthenticatedRequest extends Request {
    user?: IUSER | null;
}

export const isAuth = async (req:AuthenticatedRequest,res:Response,next:NextFunction): Promise<void> => {
    try {

        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Please login - no authheader",
            });
            return;
        }

        const token = authHeader.split(" ")[1];

        if(!token) {
            res.status(401).json({
                message: "Please login - token missing",
            });
            return;
        }

        const decodedValue = jwt.verify(token,process.env.JWT_SECRET as string) as JwtPayload;

        if(!decodedValue || !decodedValue.user) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }

        req.user = decodedValue.user;
        next();
        
    } catch (error: any) {

        res.status(401).json({
            message: error.message
        })
        
    }
}

export const isAdmin = async (req:AuthenticatedRequest,res:Response,next:NextFunction): Promise<void> => {
    try {

        const user = req.user;

        if(!user) {
            res.status(401).json({
                message: "Unauthorized"
            })

            return;
        }

        if (user.role !== "admin") {
            res.status(403).json({
                message: "Access denied"
            })

            return;
        }

        next();

        
    } catch (error: any) {

        res.status(401).json({
            message: error.message
        })
        
    }
}