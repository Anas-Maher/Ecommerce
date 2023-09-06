import Joi from "joi";
import { Types } from "mongoose";
const IsValidObjectId = (v, h) => {
    return !Types.ObjectId.isValid(v)
        ? h.message("parameter must be of type Object Id")
        : true;
};
export const add_product_schema = {
    body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        available_items: Joi.number().positive().integer().required(),
        price: Joi.number().min(1).required(),
        discount: Joi.number().min(1).max(100),
        category: Joi.string().custom(IsValidObjectId).required(),
        subcategory: Joi.string().custom(IsValidObjectId).required(),
        brand: Joi.string().custom(IsValidObjectId).required(),
    }),
};
export const productId_schema = {
    params: Joi.object({
        id: Joi.string().custom(IsValidObjectId).required(),
    }),
};
