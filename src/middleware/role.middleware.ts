import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AuthenticationError, RequestError } from '../utils/globalErrorHandler';
import { findOneUser } from '../services/user.services';

interface DecodedToken extends JwtPayload {
  userId: string;
}

export const verifyAdmin = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header('Authorization');

  if (!token) {
    return next(new AuthenticationError('Missing Authorization Header'));
  }

  try {
    const secretKey: string = process.env.JWT_SECRET_KEY || '';
    const decoded = jwt.verify(token, secretKey) as DecodedToken;
    req.userId = decoded.userId;
    const existingUser = await findOneUser({ id: decoded.userId });

    if (existingUser && existingUser.role === 'ADMIN') {
      next();
    } else {
      next(new RequestError(`Admin can update only. This user can't update`));
    }
  } catch (error) {
    next(new AuthenticationError('Invalid Token'));
  }
};

export const verifyFellesraad = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header('Authorization');

  if (!token) {
    return next(new AuthenticationError('Missing Authorization Header'));
  }

  try {
    const secretKey: string = process.env.JWT_SECRET_KEY || '';
    const decoded = jwt.verify(token, secretKey) as DecodedToken;
    req.userId = decoded.userId;
    console.log(decoded.userId);
    const existingUser = await findOneUser({ id: decoded.userId });

    if (existingUser && existingUser.role === 'FELLESRAAD') {
      next();
    } else {
      next(
        new RequestError(`Fellesraad can update only. This user can't update`)
      );
    }
  } catch (error) {
    console.log(error);
    next(new AuthenticationError('Invalid Token'));
  }
};
