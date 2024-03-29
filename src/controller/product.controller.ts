import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { v4 as uuid } from "uuid";

import { IUserWithId } from "../interface/user.interface";
import ProductService from "../service/product.service";
import { Role } from "../utils/common.enum";
import { imageBasePath } from "../utils/constants";
import { ErrorFormat, formatJOIError } from "../utils/error.format";
import { imageValidator, removeImage, uploadImage } from "../utils/helper";
import { createProductSchema, updateProductSchema } from "../validations/product.validation";

export default class ProductController {
  static async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const user: IUserWithId = req.user as IUserWithId;
      data.qty = Number(data.qty ?? 0);
      data.price = Number(data.price ?? 0);
      data.isAvailable = Boolean(data.isAvailable ?? true);


      const payload: any = await createProductSchema.validateAsync(data,{ abortEarly: false });

      if (req.files && (req.files.img as any).length > 1) {
        return res.status(StatusCodes.BAD_REQUEST).json(new ErrorFormat(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, "Upload only one image", req.baseUrl + req.path));
      } else if (req.files) {
        const image = req.files.img as UploadedFile;
        const message = imageValidator(image.size, image.mimetype);

        if (message !== null) {
          return res.status(StatusCodes.BAD_REQUEST).json(new ErrorFormat(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, message, req.baseUrl + req.path));
        }

        payload.img = imageBasePath + uploadImage(image);
      }

      payload.sku = uuid();
      payload.createdBy = user.id;


      const product = await ProductService.create(payload);

      return res.status(StatusCodes.CREATED).json({ message: "product created successfully", data: { user: product } });
    } catch (error: any) {
      if (error.isJoi) {
        let errorMessage = formatJOIError(error)
        return res.status(StatusCodes.BAD_REQUEST).json(new ErrorFormat(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, errorMessage, req.baseUrl + req.path));
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ErrorFormat(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, "something went wrong", req.baseUrl + req.path));
      }
    }
  }

  static async fetch(req: Request, res: Response) {
    try {
      const id: number = Number(req.params.id);
      const product = await ProductService.fetch(id);

      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json(new ErrorFormat(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, "no product found", req.baseUrl + req.path));
      }

      return res.json({ data: { product: product } });
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ErrorFormat(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, "something went wrong", req.baseUrl + req.path));
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
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ErrorFormat(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, "something went wrong", req.baseUrl + req.path));
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



      const product:any = await ProductService.fetch(id);

      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json(new ErrorFormat(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, "no product found", req.baseUrl + req.path));
      }

      const payload: any = await updateProductSchema.validateAsync(data);

      if (req.files && (req.files.img as any).length > 1) {
        return res.status(StatusCodes.BAD_REQUEST).json(new ErrorFormat(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, "Upload only one image", req.baseUrl + req.path));
      } else if (req.files) {
        const image = req.files.img as UploadedFile;
        const message = imageValidator(image.size, image.mimetype);

        if (message !== null) {
          return res.status(StatusCodes.BAD_REQUEST).json(new ErrorFormat(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, message, req.baseUrl + req.path));
        }

        if(product.img){
          removeImage(product.img)
        }

        payload.img = imageBasePath + uploadImage(image);
      }

      const updatedProduct = await ProductService.update(id, payload);

      return res.json({ message: "Product updated", data: { product: updatedProduct } });
    } catch (error: any) {
      if (error.isJoi) {
        let errorMessage = formatJOIError(error)

        return res.status(StatusCodes.BAD_REQUEST).json(new ErrorFormat(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, errorMessage, req.baseUrl + req.path));
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ErrorFormat(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, "something went wrong", req.baseUrl + req.path));
      }
    }
  }
  static async delete(req: Request, res: Response) {
    try {
      const id: number = Number(req.params.id);

      const product = await ProductService.fetch(id);

      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json(new ErrorFormat(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND, "no product found", req.baseUrl + req.path));
      }

      const deletedProduct = await ProductService.delete(id);

      return res.json({ message: "Product deleted", data: { product: deletedProduct } });
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ErrorFormat(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, "something went wrong", req.baseUrl + req.path));
    }
  }
}
