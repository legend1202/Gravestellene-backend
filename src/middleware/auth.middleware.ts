import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { RequestError } from '../utils/globalErrorHandler';

interface DecodedToken extends JwtPayload {
    userId: string;
}

const verifyToken = (req: Request & { userId?: DecodedToken['userId'] }, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization');
    if (!token) {
        throw new RequestError("Access denied", 401);
    }  

    try {
        const secretKey: string = process.env.JWT_SECRET_KEY || '';
        const decoded = jwt.verify(token, secretKey) as DecodedToken;
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

export default verifyToken;
