import prisma from "../config/db.config";
import { ICartItem, IProduct, IProductUpdate } from "../interface";

export default class ProductRepositoryService {
  static async create(payload: IProduct) {
    try {
      const product = await prisma.product.create({
        data: payload,
        select: { ...selectProductAttributes, createdBy: true },
      });

      return product;
    } catch (error: any) {
      throw new Error("Something went wrong while uploading the data in db");
    }
  }
  static async fetch(id: number) {
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: id,
        },
        select: { ...selectProductAttributes },
      });

      return product;
    } catch (error: any) {
      throw new Error("Something went wrong while fetching the data from db");
    }
  }
  static async fetchAll(isBookable: boolean, page: number = 1, limit: number = 10) {
    try {
      if (page <= 1) {
        page = 1;
      }

      if (limit <= 0 || limit > 100) {
        limit = 10;
      }

      const whereClause: any = {
        qty: {
          gte: isBookable ? 1 : 0,
        },
      };

      if (isBookable) {
        whereClause.isAvailable = true;
      }

      const skip = (page - 1) * limit;
      const product = await prisma.product.findMany({
        take: limit,
        skip: skip,
        where: whereClause,
        select: { ...selectProductAttributes, createdBy: isBookable ? false : true },
      });

      return product;
    } catch (error: any) {
      throw new Error("Something went wrong while fetching the data from db");
    }
  }
  static async fetchByCateogry(category: string, page: number = 1, limit: number = 10) {
    try {
      if (page <= 1) {
        page = 1;
      }

      if (limit <= 0 || limit > 100) {
        limit = 10;
      }

      const skip = (page - 1) * limit;
      const product = await prisma.product.findMany({
        take: limit,
        skip: skip,
        where: {
          category: category,
        },
        select: { ...selectProductAttributes },
      });

      return product;
    } catch (error: any) {
      throw new Error("Something went wrong while fetching the data from db");
    }
  }
  static async update(id: number, data: IProductUpdate) {
    try {
      const product = await prisma.product.update({
        where: {
          id: id,
        },
        data,
        select: { ...selectProductAttributes, createdBy: true },
      });

      return product;
    } catch (error: any) {
      throw new Error("Something went wrong while fetching the data from db");
    }
  }
  static async delete(id: number) {
    try {
      const product = await prisma.product.delete({
        where: {
          id: id,
        },
        select: { ...selectProductAttributes, createdBy: true },
      });

      return product;
    } catch (error: any) {
      throw new Error("Something went wrong while deleting the data from db");
    }
  }

  static async getProductsCount(isBookable: boolean) {
    try {
      const whereClause: any = {
        qty: {
          gte: isBookable ? 1 : 0,
        },
      };

      if (isBookable) {
        whereClause.isAvailable = true;
      }

      const count = await prisma.product.count({
        where: whereClause,
      });

      return count;
    } catch (error: any) {
      throw new Error("Something went wrong");
    }
  }

  static async findAllByIds(productIds: number[]) {
    try {
      return prisma.product.findMany({
        where: { id: { in: productIds } },
        select: selectProductAttributes,
      });
    } catch (error: any) {
      throw new Error("Something went wrong");
    }
  }

  static async updateQuantity(cartItems: ICartItem[]) {
    try {
      const updatePromises = cartItems.map(async ({ id, qty }) => {
        await prisma.product.update({
          where: { id: id },
          data: { qty: { decrement: qty } },
        });
      });

      return await Promise.all(updatePromises);
    } catch (error: any) {
      throw new Error("Something went wrong");
    }
  }
}

export const selectProductAttributes: any = {
  id: true,
  sku: true,
  img: true,
  name: true,
  qty: true,
  category: true,
  description: true,
  price: true,
  isAvailable: true,
};
