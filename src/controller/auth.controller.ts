import vine, { errors } from "@vinejs/vine";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import jwt, { Secret } from "jsonwebtoken";


import { ILoginData, IUserWithPassword } from "../interface";
import { AuthRepositoryService as AuthService } from "../service";
import { ErrorFormat } from "../utils/error.format";
import { loginSchema, registerSchema } from "../validations/common.validation";

export default class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const data = req.body;

      // validate payload
      const validator = vine.compile(registerSchema);
      const payload: IUserWithPassword = await validator.validate(data);

      // checking if email already exist
      const existUser = await AuthService.getByMail(payload.email);

      if (existUser) {
        return res.status(StatusCodes.CONFLICT).json(new ErrorFormat(StatusCodes.CONFLICT, ReasonPhrases.CONFLICT, "email is already used", req.path));
      }

      // hashing password
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(payload.password, salt);

      // Calling Auth Repo Service for storing the data in db
      const user = await AuthService.create(payload);

      return res.json({message:"user registered successfully", data : {user:user}});
    } catch (error: any) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(StatusCodes.BAD_REQUEST).json(new ErrorFormat(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, error.messages, req.path));
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ErrorFormat(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, error.message, req.path));
      }
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const data = req.body;

      // validate payload
      const validator = vine.compile(loginSchema);
      const payload: ILoginData = await validator.validate(data);

      // Get user data from db
      const user = await AuthService.getByMail(payload.email);

      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json(new ErrorFormat(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, "email or password invalid", req.path));
      }

      // Match Password
      const isPasswordMatch = await bcrypt.compare(payload.password, user.password);

      if (!isPasswordMatch) {
        return res.status(StatusCodes.UNAUTHORIZED).json(new ErrorFormat(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED, "email or password invalid", req.path));
      }

      const { password, ...userData } = user;

      const secretKey : Secret = process.env.JWT_SECRET as Secret;

      const token = jwt.sign(userData, secretKey, {
        expiresIn: "365d",
      });

      return res.json({messaage:"login successfully", data:{user : userData}, access_token: `Bearer ${token}`});

    } catch (error: any) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(StatusCodes.BAD_REQUEST).json(new ErrorFormat(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, error.messages, req.path));
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ErrorFormat(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, error.message, req.path));
      }
    }
  }
}
