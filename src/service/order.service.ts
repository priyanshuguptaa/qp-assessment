import prisma from "../config/db.config";

export default class OrderRepositoryService {
  static async create(data: any) {
    try {
      const order = await prisma.order.create({
        data: {
          ...data,
          products: {
            connect: data.products,
          },
        },

        include: includeRelation,
      });

      return order;
    } catch (error) {
      throw new Error("Something went wrong while uploading the data in db");
    }
  }

  static async get(id: number) {
    try {
      const order = await prisma.order.findUnique({
        where: {
          id: id,
        },
        include: includeRelation,
      });

      return order;
    } catch (error) {
      throw new Error("Something went wrong while dealing with db");
    }
  }

  static async getAll(page: number = 1, limit: number = 10) {
    try {
      if (page <= 1) {
        page = 1;
      }

      if (limit <= 0 || limit > 100) {
        limit = 10;
      }

      const skip = (page - 1) * limit;
      const order = await prisma.order.findMany({
        take: limit,
        skip: skip,
        include: includeRelation,
      });

      return order;
    } catch (error) {
      throw new Error("Something went wrong while dealing with db");
    }
  }

  static async getCount() {
    try {
      const count = await prisma.order.count();
      return count;
    } catch (error) {
      throw new Error("Something went wrong while dealing with db");
    }
  }
}

const includeRelation = {
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    },
  },
  products: {
    select: {
      id: true,
      sku: true,
      name: true,
      category: true,
      description: true,
      price: true,
    },
  },
};
