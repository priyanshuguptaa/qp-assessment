import { Request, Response } from "express";
import vine, { errors } from "@vinejs/vine";
import bcrypt from "bcryptjs";
import { User } from "../interface/common.interface";
import { registerSchema } from "../validations/common.validation";
import { ErrorFormat } from "../utils/error.format";

import { ReasonPhrases, StatusCodes } from "http-status-codes";

export default class AuthController {
  static async register(req: Request, res: Response) {
    console.log("route hit")
    try {
      const data = req.body;

      // validate payload
      const validator = vine.compile(registerSchema);
      const payload: User = await validator.validate(data);

      // hashing password
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(payload.password, salt);

      return res.json({ mess: "Register route" });
    } catch (error: any) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(StatusCodes.BAD_REQUEST).json(new ErrorFormat(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, error.messages, req.path));
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ErrorFormat(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, error.message, req.path)) ;
      }
    }
  }
}
