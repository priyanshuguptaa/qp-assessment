import express from "express";

import  ProductController  from "../controller/product.controller";
import AuthMiddleware from "../middleware/auth.middleware";
import RoleMiddleware from "../middleware/role.middleware";
import { Role } from "../utils/common.enum";

const router = express.Router();

router.post("/create",AuthMiddleware,RoleMiddleware(Role.ADMIN),ProductController.create)
router.get("/all",AuthMiddleware, ProductController.fetchAll)
router.get("/:id",AuthMiddleware, ProductController.fetch)
router.patch("/:id",AuthMiddleware,RoleMiddleware(Role.ADMIN),ProductController.update)
router.delete("/:id",AuthMiddleware,RoleMiddleware(Role.ADMIN),ProductController.delete)



export default router;

