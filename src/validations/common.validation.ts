import vine from "@vinejs/vine";

import { Role } from "../utils/common.enum";
import { CustomErrorReporter } from "./custom.error";


vine.errorReporter = () => new CustomErrorReporter();


export const registerSchema = vine.object({
  firstName: vine.string().minLength(2).maxLength(150),
  lastName: vine.string().minLength(2).maxLength(150),
  email: vine.string().email(),
  password: vine.string().minLength(6).maxLength(100).confirmed(),
  phone: vine.string().minLength(10).maxLength(10),
  role: vine.enum(Role).optional(),
});

export const loginSchema = vine.object({
  email: vine.string().email(),
  password: vine.string(),
});


