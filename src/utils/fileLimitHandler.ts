import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ErrorFormat } from "./error.format";


export const  fileLimitHandler = (req : Request, res: Response) =>{
    res.status(StatusCodes.REQUEST_TOO_LONG).json(new ErrorFormat(StatusCodes.REQUEST_TOO_LONG, ReasonPhrases.REQUEST_TOO_LONG, "File Size too large", req.path))
}