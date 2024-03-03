import vine from "@vinejs/vine";
import { CustomErrorReporter } from "./custom.error";

vine.errorReporter = () => new CustomErrorReporter();

export const createProductSchema = vine.object({
    name: vine.string().minLength(3).maxLength(100),
    qty: vine.number().positive(),
    category: vine.string().minLength(3).maxLength(100),
    description: vine.string().minLength(3).maxLength(500),
    price: vine.number().positive(),
    isAvailable: vine.boolean()
});

export const updateProductSchema = vine.object({
    name: vine.string().minLength(3).maxLength(100).optional(),
    qty: vine.number().positive().optional(),
    category: vine.string().minLength(3).maxLength(100).optional(),
    description: vine.string().minLength(3).maxLength(500).optional(),
    price: vine.number().positive().optional(),
    isAvailable: vine.boolean().optional()
});
