import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { IUser } from "../interface";
import { ErrorFormat } from "../utils/error.format";

const roleMiddleware = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user: IUser | undefined = req.user;

    if (!user || !user.role) {
      return res.status(StatusCodes.UNAUTHORIZED).json(new ErrorFormat(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, "unauthorized", req.baseUrl + req.path));
    }

    if (user.role !== role) {
      return res.status(StatusCodes.UNAUTHORIZED).json(new ErrorFormat(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, "unauthorized", req.baseUrl + req.path));
    }

    next();
  };
};


export default roleMiddleware;