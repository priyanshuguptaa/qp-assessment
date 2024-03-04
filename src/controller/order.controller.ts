import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ICartItem, IOrderWithId } from "../interface";
import { OrderRepositoryService as OrderService, ProductRepositoryService as ProductService } from "../service";
import { ErrorFormat } from "../utils/error.format";
import prisma from "../config/db.config";
import { Role } from "../utils/common.enum";

export default class OrderController {
  static async create(req: Request, res: Response) {
    try {
      const orderDetails = await prisma.$transaction(async () => {
        const user = req.user;

        const { cartItems }: { cartItems: ICartItem[] } = req.body;

        const productIds: number[] = cartItems?.map((item) => {
          return item.id;
        });

        if (productIds.length <= 0) {
          return res.status(StatusCodes.BAD_REQUEST).json(new ErrorFormat(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, "No product id found", req.path));
        }

        const productsData: any = await ProductService.findAllByIds(productIds);

        const productMap = new Map<number, IOrderWithId>(productsData.map((product: IOrderWithId) => [product.id, product]));

        console.log(productMap);
        let totalPrice = 0;
        let totalProduct = 0;
        let productError = [];

        for (const item of cartItems) {
          const product = productMap.get(item.id);

          if (!product || !product?.isAvailable) {
            productError.push(`Product ${item.id} not available`);
          } else if (!product || product.qty < item.qty) {
            productError.push(`Insufficient stock for product ${product?.name}`);
          }
        }

        if (productError.length) {
          return res.status(StatusCodes.BAD_REQUEST).json(new ErrorFormat(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, productError.join(", "), req.path));
        }

        for (const item of cartItems) {
          const product = productMap.get(item.id);

          totalPrice += item.qty * product!.price;
          totalProduct += item.qty;
        }

        const updatedData = await ProductService.updateQuantity(cartItems);

        let orderDetails = {
          totalPrice,
          totalProduct,
          products: cartItems?.map((item) => {
            return { id: item.id };
          }),
          purchasedBy: user!.id,
        };

        const orderCreated = await OrderService.create(orderDetails);

        return orderCreated;
      });

      return res.json({ message: "order placed successfully", data: { orderDetails: orderDetails } });
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ErrorFormat(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, "Something went wrong", req.path));
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const orderId = Number(req.params.id);
      const user = req.user;

      const orderDetails = await OrderService.get(orderId);

      if (!orderDetails) {
        return res.status(StatusCodes.BAD_REQUEST).json(new ErrorFormat(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, "No order detail found", req.path));
      } else if (user!.role === Role.USER && orderDetails.purchasedBy !== user!.id) {
        return res.status(StatusCodes.BAD_REQUEST).json(new ErrorFormat(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST, "unauthorized user", req.path));
      }

      return res.json({data:{orderDetails}});
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ErrorFormat(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, "Something went wrong", req.path));
    }
  }

  static async getAll(req: Request, res: Response) {
    try {


      const page: number = Number(req.query.page ?? 1);
      const limit: number = Number(req.query.limit ?? 10);
      const count : number = await OrderService.getCount();
      
      const totalPages = Math.ceil(count / limit);

      const orderData = await OrderService.getAll(page, limit);


      return res.json({data:orderData, metadata: { currentPage: page, currentLimit: limit, totalPage: totalPages, totalProduct: count }})



    } catch (error) {
      
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(new ErrorFormat(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, "Something went wrong", req.path));
    }
  }
}
