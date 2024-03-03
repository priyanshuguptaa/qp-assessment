import { Role } from "../utils/common.enum";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  password_confirmation ?: string;
  phone: string;
  role ?: Role;
}

interface Address {
  id?: number;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  user?: User;
  userId?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface Product {
  id?: number;
  img?: string | null;
  name?: string;
  qty?: number;
  category?: string;
  description?: string;
  price?: number;
  user?: User;
  createdBy?: number;
  created_at?: Date;
  updated_at?: Date;
}



export {
    User, Address, Product
}
