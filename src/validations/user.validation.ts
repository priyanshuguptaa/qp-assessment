import joi from "joi"


import { Role } from "../utils/common.enum";


export const registerSchema = joi.object({
  firstName: joi.string().min(2).max(150).required(),
  lastName: joi.string().min(2).max(150).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).max(100).required(),
  confirmPassword: joi.string().valid(joi.ref('password')).required(),
  phone: joi.string().min(10).max(10).required(),
  role: joi.valid(Role.ADMIN,Role.USER).optional(),
});

export const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});


