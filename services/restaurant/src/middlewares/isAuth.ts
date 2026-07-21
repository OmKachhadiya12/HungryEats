import { Request,Response,NextFunction } from "express";
import jwt , { JwtPayload } from "jsonwebtoken";

export interface IUSER {
    _id: string;
    name: string;
    email: string;
    image: string;
    role: string;
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

export const isSeller = async (req:AuthenticatedRequest,res:Response,next:NextFunction): Promise<void> => {
    try {

        const user = req.user;

        if(user && user.role !== "seller") {
            res.status(401).json({message: "You are not authorized to be a seller. "})
            return;
        }

        next();
        
    } catch (error: any) {

        res.status(401).json({
            message: error.message
        })
        
    }
}