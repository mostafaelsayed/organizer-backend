import jwt from 'jsonwebtoken';
import { secret } from './config';
import { NotAuthenticatedResponse } from './models/response/error';
import { Request, Response, NextFunction } from 'express';
export function getToken(email: string, id: number | undefined): string {
  return jwt.sign({ email, id }, secret, { expiresIn: 24 * 60 * 60 });
}

export function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers['authorization'];

  if (req.url !== '/api/register' && req.url !== '/api/login') {
    jwt.verify(token as string, secret, (err, decoded) => {
      if (err) {
        console.error('Failed to authenticate token.');
        return new NotAuthenticatedResponse('verify token').sendResponse(res);
      } else {
        res.locals.user = decoded;
        next();
      }
    });
  } else {
    next();
  }
}