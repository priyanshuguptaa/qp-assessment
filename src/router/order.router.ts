import express from "express";
import { OrderController } from "../controller";
import { AuthMiddleware, RoleMiddleware } from "../middleware";
import { Role } from "../utils/common.enum";

const router = express.Router();

router.post("/create", AuthMiddleware, OrderController.create);
router.get("/all", AuthMiddleware,RoleMiddleware(Role.ADMIN), OrderController.getAll);
router.get("/:id", AuthMiddleware, OrderController.get);

export default router;
