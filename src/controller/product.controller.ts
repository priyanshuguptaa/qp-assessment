import vine, { errors } from "@vinejs/vine";
import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { v4 as uuid } from "uuid";

import { IUserWithId } from "../interface";
import { ProductRepositoryService as ProductService } from "../service";
import { ErrorFormat } from "../utils/error.format";
import { createProductSchema, updateProductSchema } from "../validations";
import { Role } from "../utils/common.enum";

export default class ProductController {
  static async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const user: IUserWithId = req.user as IUserWithId;
      data.qty = Number(data.qty ?? 0);
      data.price = Number(data.price ?? 0);
      data.isAvailable = Boolean(data.isAvailable ?? true);

      const validator = vine.compile(createProductSchema);
      const payload: any = await validator.validate(data);

      payload.sku = uuid();
      payload.createdBy = user.id;

      console.log("product payload", payload);

      const product = await ProductService.create(payload);

      return res.status(StatusCodes.CREATED).json({ message: "product created successfully", data: { user: product } });
    } catch (error: any) {
      console.log(error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(StatusCodes.BAD_REQUEST).json(new ErrorFormat(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, error.messages, req.path));
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ErrorFormat(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, "something went wrong", req.path));
      }
    }
  }

  static async fetch(req: Request, res: Response) {
    try {
      const id: number = Number(req.params.id);
      const product = await ProductService.fetch(id);

      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json(new ErrorFormat(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, "no product found", req.path));
      }

      return res.json({ data: { product: product } });
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ErrorFormat(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, "something went wrong", req.path));
    }
  }
  static async fetchAll(req: Request, res: Response) {
    try {
      const page: number = Number(req.query.page ?? 1);
      const limit: number = Number(req.query.limit ?? 10);
      const user: IUserWithId = req.user as IUserWithId;
      const isBookable = user.role === Role.USER ? true : false;

      const product = (await ProductService.fetchAll(isBookable, page, limit)) ?? [];
      const count = await ProductService.getProductsCount(isBookable);
      const totalPages = Math.ceil(count / limit);

      return res.json({ data: { products: product }, metadata: { currentPage: page, currentLimit: limit, totalPage: totalPages, totalProduct: count } });
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ErrorFormat(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, "something went wrong", req.path));
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id: number = Number(req.params.id);

      const data = req.body;

      if (data.qty) {
        data.qty = Number(data.qty);
      }

      if (data.price) {
        data.price = Number(data.price);
      }

      if (data.isAvailable) {
        data.isAvailable = Boolean(data.isAvailable ?? true);
      }

      const product = await ProductService.fetch(id);

      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json(new ErrorFormat(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, "no product found", req.path));
      }

      const validator = vine.compile(updateProductSchema);
      const payload: any = await validator.validate(data);

      const updatedProduct = await ProductService.update(id, payload);

      return res.json({ message: "Product updated", data: { product: updatedProduct } });
    } catch (error: any) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(StatusCodes.BAD_REQUEST).json(new ErrorFormat(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, error.messages, req.path));
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ErrorFormat(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, "something went wrong", req.path));
      }
    }
  }
  static async delete(req: Request, res: Response) {
    try {
      const id: number = Number(req.params.id);

      const product = await ProductService.fetch(id);

      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json(new ErrorFormat(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, "no product found", req.path));
      }

      const deletedProduct = await ProductService.delete(id);

      return res.json({ message: "Product deleted", data: { product: deletedProduct } });


    } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ErrorFormat(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, "something went wrong", req.path));
    }
  }
}
