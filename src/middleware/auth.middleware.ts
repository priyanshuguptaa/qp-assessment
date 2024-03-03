import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import jwt, { Secret } from "jsonwebtoken";
import { IUser } from "../interface/common.interface";
import { ErrorFormat } from "../utils/error.format";

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Define the user property
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader === null || authHeader === undefined) {
     return res.status(StatusCodes.UNAUTHORIZED).json(new ErrorFormat(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, "unauthorized", req.path));
  }

  const token = authHeader.split(" ")?.[1];

  // Verify the JWT token

  const secretKey: Secret = process.env.JWT_SECRET as Secret;

  

  jwt.verify(token, secretKey, (err : any, user) => {
    if (err) return res.status(StatusCodes.UNAUTHORIZED).json(new ErrorFormat(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, "unauthorized", req.path));
    req.user = user as IUser;
    next();
  });
};

export default authMiddleware;
