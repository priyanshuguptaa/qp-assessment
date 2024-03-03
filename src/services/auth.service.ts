

import prisma from "../config/db.config";
import { User } from "../interface/common.interface";


export class AuthRepositoryService {
  static async create(payload: User) {
    try {
      const user = await prisma.user.create({
        data: payload,
      });

      return user;
    } catch (error) {
      throw new Error("Something went wrong while uploading the data in db");
    }
  }

  static async getById(id: number) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          created_at: false,
          updated_at: false,
          password: false,
        },
      });

      if (!user) {
        throw new Error("No user found");
      }

      return user;
    } catch (error) {
      throw new Error("Something went wrong while dealing with db");
    }
  }

  static async getByMail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
          created_at: false,
          updated_at: false,
        },
      });

      if (!user) {
        throw new Error("No user found");
      }

      return user;
    } catch (error) {
      throw new Error("Something went wrong while dealing with db");
    }
  }
}
