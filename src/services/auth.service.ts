import prisma from "../config/db.config";
import { IUser, IUserWithPassword } from "../interface/common.interface";

export default class AuthRepositoryService {
  static async create(payload: IUserWithPassword) {
    try {
      const user = await prisma.user.create({
        data: payload,
        select: selectAttributes,
      });

      return user;
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong while uploading the data in db");
    }
  }

  static async getById(id: number) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
        select: selectAttributes,
      });

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
        select: {...selectAttributes, password:true},
      });

      return user;
    } catch (error) {
      throw new Error("Something went wrong while dealing with db");
    }
  }
}

const selectAttributes = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  role: true,
};
