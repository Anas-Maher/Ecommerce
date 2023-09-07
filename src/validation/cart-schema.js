import joi from "joi";
import IsValidObjectId from "../utils/Is_valid_object_Id.js";

export const add2cart_schema = {
    body: joi.object({
        product_id: joi.string().custom(IsValidObjectId).required(),
        quantity: joi.number().integer().min(1).max(250).required(),
    }),
};
export const update_cart_schema = {
    body: joi.object({
        product_id: joi.string().custom(IsValidObjectId).required(),
        quantity: joi.number().integer().min(1).max(250).required(),
    }),
};
export const remove_product_cart_schema = {
    params: joi.object({
        product_id: joi.string().custom(IsValidObjectId).required(),
    }),
};
