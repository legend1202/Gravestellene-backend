import { JwtPayload } from 'jsonwebtoken';

export interface DecodedToken extends JwtPayload {
  userId: string;
}

export interface DateRange {
  start: string;
  end: string;
}
