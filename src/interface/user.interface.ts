import { Role } from "../utils/common.enum";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role ?: Role;
}

export interface IUserWithId extends IUser{
  id: number
}

export interface IUserWithPassword extends IUser {
  password: string;
  confirmPassword ?: string;
}

export interface ILoginData {
  email: string;
  password: string;
}








