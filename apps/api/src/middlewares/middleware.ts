import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export function authMiddleware(req: Request,res: Response,next: NextFunction) {
  let token: string | undefined = req.headers.authorization;

  if (!token) {
    token = req.query.token as string;

    if (!token) {
      return res.status(401).json({
        success: false,
        error : "UNAUTHORIZED",
        data : null ,
        message: "token not found",
      });
    }
  }

  const JWT_SECRET: string | undefined = process.env.JWT_SECRET;

  if (token && JWT_SECRET) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
        id: string;
      };

      if (decoded) {
        const userId: string = decoded.id;
        req.userId = userId;
      }

      next();
    } catch (e) {
      return res.status(401).json({
        success: false,
        message: "Token Invalid",
      });
    }
  } else {
    return res.status(401).json({
        success: false,
        error : "UNAUTHORIZED",
        data : null ,
        message: "token not found",
      });
  }
}
