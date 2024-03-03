import { IUser } from "./user.interface";

export interface IProduct {
    id?: number;
    sku : string;
    img?: string | null;
    name: string;
    qty: number;
    category: string;
    description: string;
    price: number;
    createdBy: number;
  }

  export interface IProductUpdate{
    img?: string | null;
    name?: string;
    qty?: number;
    category?: string;
    description?: string;
    price?: number;
  }