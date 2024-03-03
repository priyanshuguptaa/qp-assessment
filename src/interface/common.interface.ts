import { Role } from "../utils/common.enum";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role ?: Role;
}

export interface IUserWithPassword extends IUser {
  password: string;
  password_confirmation ?: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IAddress {
  id?: number;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  user?: IUser;
  userId?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Product {
  id?: number;
  img?: string | null;
  name?: string;
  qty?: number;
  category?: string;
  description?: string;
  price?: number;
  user?: IUser;
  createdBy?: number;
  created_at?: Date;
  updated_at?: Date;
}




