export interface IOrder {
  totalPrice: number;
  totalProduct: number;
  purchasedBy: number;
  products: { id: string }[];
}

export interface ICartItem {
  id: number;
  qty: number;
}

export interface IOrderWithId {
  id: number;
  sku: string;
  img: string | null;
  name: string;
  qty: number;
  category: string;
  description: string;
  price: number;
  isAvailable: boolean;
}
