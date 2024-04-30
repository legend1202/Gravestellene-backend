import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AuthenticationError, RequestError } from '../utils/globalErrorHandler';
import { DecodedToken } from '../types/req.type';

const verifyToken = (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response,
  next: NextFunction
): void => {
  const token = req.header('Authorization');
  if (!token) {
    return next(new AuthenticationError('Missing Authorization Header'));
  }

  try {
    const secretKey: string = process.env.JWT_SECRET_KEY || '';
    const decoded = jwt.verify(token, secretKey) as DecodedToken;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(new AuthenticationError('Invalid Token'));
  }
};

export default verifyToken;
