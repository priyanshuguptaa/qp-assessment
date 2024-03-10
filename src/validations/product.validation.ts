import joi from "joi"



export const createProductSchema = joi.object({
    name: joi.string().min(3).max(100).required(),
    qty: joi.number().positive().required(),
    category: joi.string().min(3).max(100).required(),
    description: joi.string().min(3).max(500).required(),
    price: joi.number().positive().required(),
    isAvailable: joi.boolean()
});

export const updateProductSchema = joi.object({
    name: joi.string().min(3).max(100).optional(),
    qty: joi.number().positive().optional(),
    category: joi.string().min(3).max(100).optional(),
    description: joi.string().min(3).max(500).optional(),
    price: joi.number().positive().optional(),
    isAvailable: joi.boolean().optional()
});
